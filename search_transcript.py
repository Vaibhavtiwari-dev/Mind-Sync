import json

transcript_path = r"C:\Users\Vaibhav\.gemini\antigravity\brain\148ddee5-e88e-4f7f-8f97-5379f11bc67d\.system_generated\logs\transcript.jsonl"

target_steps = set(range(660, 678))

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.strip():
            obj = json.loads(line)
            if obj.get("step_index") in target_steps:
                print(f"=== Step {obj.get('step_index')} (type: {obj.get('type')}, source: {obj.get('source')}) ===")
                print(json.dumps(obj, indent=2)[:3000])





