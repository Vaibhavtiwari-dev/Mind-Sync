import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTasks, createTask, updateTask, deleteTask, toggleTaskStatus } from "../tasks";
import { db } from "@/db";
import { requireWorkspaceAuth } from "../shared";

// Mock dependencies
vi.mock("@/actions/shared", () => ({
  requireAuth: vi.fn().mockResolvedValue({ userId: "test-user-123" }),
  requireWorkspaceAuth: vi.fn().mockResolvedValue({ 
    userId: "test-user-123", 
    workspaceId: "test-workspace-123" 
  }),
  ensureUserExists: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/rate-limiter", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@/lib/data-fetchers", () => ({
  getCachedTasks: vi.fn().mockResolvedValue([
    { id: "123", title: "Task 1", status: "Todo" },
    { id: "456", title: "Task 2", status: "Done" },
  ]),
  CACHE_TAGS: {
    tasks: (wsId: string) => `tasks-${wsId}`,
    dashboard: (wsId: string) => `dashboard-${wsId}`,
  },
}));

// Mock DB
const mocks = {
  selectWhere: vi.fn().mockReturnThis(),
  insertValues: vi.fn().mockResolvedValue(true),
  updateWhere: vi.fn().mockResolvedValue(true),
  deleteWhere: vi.fn().mockResolvedValue(true),
};

vi.mock("@/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: mocks.selectWhere,
      }),
    }),
    insert: vi.fn().mockReturnValue({ values: mocks.insertValues }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: mocks.updateWhere,
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: mocks.deleteWhere,
    }),
  },
}));

describe("Tasks Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should return tasks successfully", async () => {
      const result = await getTasks();

      expect(requireWorkspaceAuth).toHaveBeenCalled();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
      }
    });

    it("should handle unauthenticated error", async () => {
      (requireWorkspaceAuth as any).mockRejectedValueOnce(new Error("Unauthorized"));

      const result = await getTasks();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Unauthorized");
      }
    });
  });

  describe("createTask", () => {
    const validData = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "New Task",
    };

    it("should create a task successfully", async () => {
      const result = await createTask(validData);
      expect(result).toEqual({ success: true, data: undefined });

      expect(requireWorkspaceAuth).toHaveBeenCalled();
      expect(vi.mocked(require("@/lib/rate-limiter").checkRateLimit)).toHaveBeenCalledWith("test-user-123", "create-task", 100, 60);
      expect(db.insert).toHaveBeenCalled();
    });

    it("should reject if rate limited", async () => {
      vi.mocked(require("@/lib/rate-limiter").checkRateLimit).mockResolvedValueOnce({ allowed: false, retryAfter: 60 });

      const result = await createTask(validData);
      expect(result.success).toBe(false);
      expect(db.insert).not.toHaveBeenCalled();
    });

    it("should reject invalid data", async () => {
      const result = await createTask({ id: "invalid-id", title: "" }); // Empty title fails Zod
      expect(result.success).toBe(false);
      expect(db.insert).not.toHaveBeenCalled();
    });
  });

  describe("updateTask", () => {
    it("should update task properties successfully", async () => {
      const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {
        title: "Updated Title",
      });

      expect(db.update).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it("should skip DB update if no properties provided", async () => {
      const result = await updateTask("123e4567-e89b-12d3-a456-426614174000", {});

      expect(db.update).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe("toggleTaskStatus", () => {
    it("should set task to Done when completed is true", async () => {
      const result = await toggleTaskStatus("123e4567-e89b-12d3-a456-426614174000", true);

      expect(db.update).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it("should return success even if task doesn't exist (optimistic UI resilience)", async () => {
      const result = await toggleTaskStatus("non-existent", true);

      expect(db.update).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      const result = await deleteTask("123e4567-e89b-12d3-a456-426614174000");

      expect(requireWorkspaceAuth).toHaveBeenCalled();
      expect(db.delete).toHaveBeenCalled();
      expect(mocks.deleteWhere).toHaveBeenCalled();
    });

    it("should require valid ID", async () => {
      const result = await deleteTask("");
      expect(result.success).toBe(false);
    });
  });
});
