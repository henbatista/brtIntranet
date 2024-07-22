import { forEach } from "lodash";

export const populateModal = <
  Data extends object,
  dataRef extends globalThis.Ref<Data>,
>(
  modalData: Data,
  refData: dataRef
) => {
  forEach(modalData, (value: any, key: string) => {
    refData.value[key as keyof Data] = value;
  });
};
