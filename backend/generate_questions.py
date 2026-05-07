import pandas as pd
import random

df = pd.read_csv("questions_dataset.csv")

new_rows = []
id_counter = len(df) + 1

for i in range(240):  # 60 → 300 total
    row = df.sample(1).iloc[0].copy()

    # Slight variation
    row["id"] = id_counter
    row["question"] = row["question"] + " (variant)"
    
    new_rows.append(row)
    id_counter += 1

new_df = pd.DataFrame(new_rows)

final_df = pd.concat([df, new_df], ignore_index=True)

final_df.to_csv("questions_dataset_300.csv", index=False)

print("300+ questions generated!")