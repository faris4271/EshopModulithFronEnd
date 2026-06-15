export function objectToFormData(
  obj: any,
  namespace: string | null = null,
  formData: FormData = new FormData()
): FormData {
  for (const property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property) && obj[property] !== null && obj[property] !== undefined) {
      const key = namespace ? `${namespace}[${property}]` : property;

      if (obj[property] instanceof File) {
        formData.append(key, obj[property]);
      } else if (Array.isArray(obj[property])) {
        // Special handling for File arrays to support IFormFileCollection
        if (obj[property].length > 0 && obj[property][0] instanceof File) {
          obj[property].forEach((file: File) => {
            formData.append(key, file, file.name);
          });
        } else {
          obj[property].forEach((element: any, index: number) => {
            if (element instanceof File) {
              formData.append(`${key}[${index}]`, element);
            } else if (typeof element === 'object' && element !== null) {
              objectToFormData(element, `${key}[${index}]`, formData);
            } else {
              formData.append(`${key}[${index}]`, element);
            }
          });
        }
      } else if (typeof obj[property] === 'object') {
        objectToFormData(obj[property], key, formData);
      } else {
        formData.append(key, obj[property]);
      }
    }
  }
  return formData;
}
