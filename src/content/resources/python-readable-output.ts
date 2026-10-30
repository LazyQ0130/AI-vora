// P13正文、参考和真实进程共享源码。独立预测在作者验证器登记。
const receive='item_name = input("Item: ")\ncount_text = input("Count: ")\nmass_text = input("Mass kg: ")';
const calculate=receive+'\n\ncount = int(count_text)\nmass = float(mass_text)\n\ntotal_mass = count * mass\nwithin_limit = total_mass <= 10';
export const readableCode={
  plain:'total_mass = 6.0\nwithin_limit = True\n\nprint(total_mass)\nprint(within_limit)',
  insert:'total_mass = 6.0\nprint(f"Total kg: {total_mass}")',
  literal:'total_mass = 6.0\nprint("Total kg: {total_mass}")',
  labels:'item_name = "Parcel"\ncount = 4\ntotal_mass = 6.0\n\nprint(f"Item: {item_name}")\nprint(f"Count: {count}")\nprint(f"Total kg: {total_mass}")',
  chinese:'total_mass = 6.0\nprint(f"总质量（千克）：{total_mass}")',
  receive,
  calculate:calculate+'\n\nprint(total_mass)\nprint(within_limit)',
  main:calculate+'\n\nprint(f"Item: {item_name}")\nprint(f"Count: {count}")\nprint(f"Total kg: {total_mass}")\nprint(f"Within 10 kg: {within_limit}")',
  ownSummary:'material_name = input("Material: ")\npieces_text = input("Pieces: ")\nlength_text = input("Length m: ")\npieces = int(pieces_text)\nlength = float(length_text)\ntotal_length = pieces * length\nprint(f"Material: {material_name}")\nprint(f"Pieces: {pieces}")\nprint(f"Total m: {total_length}")',
  ownBoundary:'batch_name = input("Batch: ")\nstrips_text = input("Strips: ")\nstrip_text = input("Strip m: ")\nstrips = int(strips_text)\nstrip_length = float(strip_text)\nlength_limit = 12\ntotal_length = strips * strip_length\nwithin_limit = total_length <= length_limit\nprint(f"Batch: {batch_name}")\nprint(f"Strips: {strips}")\nprint(f"Total m: {total_length}")\nprint(f"Within {length_limit} m: {within_limit}")',
  nameError:'total_mass = 6.0\nprint(f"Total kg: {total_mas}")',
  nameRepair:'total_mass = 6.0\nprint(f"Total kg: {total_mass}")',
}as const;
export type ReadableKey=keyof typeof readableCode;
export const readableBlockNames:Record<ReadableKey,string>={
  plain:"bare_results.py",insert:"insert_mass.py",literal:"literal_mass.py",labels:"known_summary.py",chinese:"chinese_mass.py",receive:"receive_parcel.py",calculate:"calculate_parcel.py",main:"parcel_summary.py",
  ownSummary:"material_summary.py · 题一参考",ownBoundary:"garden_boundary.py · 题二参考",nameError:"field_copy.py · 名称错拼副本",nameRepair:"field_copy.py · 名称修复副本",
};
