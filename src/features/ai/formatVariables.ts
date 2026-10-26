/** "{{topic}}, {{tone}}" لعرض أسماء المتغيرات بالرسائل (بتنعرض داخل <bdi dir="ltr"> عشان ما تتبعثر بالعربي) */
export function formatVariableList(names: string[]): string {
  return names.map((name) => `{{${name}}}`).join(', ')
}