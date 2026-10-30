// P12正文、参考程序和作者真实进程验证共用源码；独立预期另见运行器。
export const inputCode = {
  label: 'label = input("Label: ")\nprint(label)',
  rawCount: 'count_text = input("Count: ")\nprint(count_text)\nprint(type(count_text))',
  convertInt: 'count_text = input("Count: ")\ncount = int(count_text)\nprint(count)\nprint(type(count))',
  inspectInt: 'count_text = input("Count: ")\nprint(count_text)\nprint(type(count_text))\ncount = int(count_text)\nprint(count)\nprint(type(count))',
  main: 'label = input("Label: ")\ncount_text = input("Count: ")\ncount = int(count_text)\n\nprint(label)\nprint(count * 3)',
  mass: 'mass_text = input("Mass kg: ")\nmass = float(mass_text)\nprint(mass * 2)',
  inspectFloat: 'mass_text = input("Mass kg: ")\nprint(mass_text)\nprint(type(mass_text))\nmass = float(mass_text)\nprint(mass)\nprint(type(mass))',
  integerError: 'count_text = input("Count: ")\ncount = int(count_text)\nprint(count)',
  floatError: 'mass_text = input("Mass kg: ")\nmass = float(mass_text)\nprint(mass * 2)',
  ownInteger: 'venue_name = input("Venue: ")\nteam_text = input("Teams: ")\nteams = int(team_text)\nprint(venue_name)\nprint(teams * 5)',
  ownMeasure: 'length_text = input("Length m: ")\nlength = float(length_text)\nprint(length * 4)',
  measureError: 'length_text = input("Length m: ")\nlength = float(length_text)\nprint(length * 4)',
} as const;
export type InputKey = keyof typeof inputCode;
export const inputBlockNames: Record<InputKey,string> = {
  label:"receive_label.py", rawCount:"inspect_input.py", convertInt:"convert_count.py", inspectInt:"observe_conversion.py", main:"item_labels.py",
  mass:"two_masses.py", inspectFloat:"observe_mass.py", integerError:"count_format_copy.py · 受控副本", floatError:"mass_format_copy.py · 受控副本",
  ownInteger:"event_badges.py · 参考程序", ownMeasure:"cord_lengths.py · 参考程序", measureError:"cord_format_copy.py · 参考受控副本",
};
