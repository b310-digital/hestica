import { Dropdown } from "react-native-element-dropdown";
import { RecipeFormValues } from "./RecipeInputForm";
import { UseControllerProps, useController } from "react-hook-form";
import { dropDownStyles } from "./styles";
import { useTranslation } from "react-i18next";

export const UnitDropdown = (props: UseControllerProps<RecipeFormValues>) => {
  const {
    field: { onChange, value, onBlur },
  } = useController(props);
  const { t } = useTranslation();

  const VOLUME_UNITS = [
    { unit: "ml", label: t("units.volume.ml") },
    { unit: "l", label: t("units.volume.l") },
    { unit: "dl", label: t("units.volume.dl") },
    { unit: "tsp", label: t("units.volume.tsp") },
    { unit: "tbs", label: t("units.volume.tbs") },
    { unit: "floz", label: t("units.volume.floz") },
    { unit: "gill", label: t("units.volume.gill") },
    { unit: "cup", label: t("units.volume.cup") },
    { unit: "pint", label: t("units.volume.pint") },
    { unit: "quart", label: t("units.volume.quart") },
    { unit: "gallon", label: t("units.volume.gallon") },
  ];
  const WEIGHT_UNITS = [
    { unit: "mg", label: t("units.weight.mg") },
    { unit: "g", label: t("units.weight.g") },
    { unit: "kg", label: t("units.weight.kg") },
    { unit: "pound", label: t("units.weight.pound") },
    { unit: "ounce", label: t("units.weight.ounce") },
  ];
  const MISC_UNITS = [
    { unit: "can", label: t("units.misc.can") },
    { unit: "pcs", label: t("units.misc.pcs") },
    { unit: "pkg", label: t("units.misc.pkg") },
  ];
  const UNITS = [...VOLUME_UNITS, ...WEIGHT_UNITS, ...MISC_UNITS];

  return (
    <Dropdown
      search
      onBlur={onBlur}
      data={UNITS}
      labelField="label"
      valueField="unit"
      searchField="unit"
      style={[dropDownStyles.dropdown, { marginTop: 6 }]}
      value={value as string}
      searchPlaceholder={t("search")}
      placeholder={t("unit")}
      placeholderStyle={dropDownStyles.placeholderStyle}
      selectedTextStyle={dropDownStyles.selectedTextStyle}
      inputSearchStyle={dropDownStyles.inputSearchStyle}
      iconStyle={dropDownStyles.iconStyle}
      onChange={(item: { unit: string; label: string }) => onChange(item.unit)}
    />
  );
};

export default UnitDropdown;
