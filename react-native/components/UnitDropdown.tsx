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
    { unit: "ml", label: t("units.ml") },
    { unit: "l", label: t("units.l") },
    { unit: "dl", label: t("units.dl") },
    { unit: "tsp", label: t("units.tsp") },
    { unit: "tbs", label: t("units.tbs") },
    { unit: "floz", label: t("units.floz") },
    { unit: "gill", label: t("units.gill") },
    { unit: "cup", label: t("units.cup") },
    { unit: "pint", label: t("units.pint") },
    { unit: "quart", label: t("units.quart") },
    { unit: "gallon", label: t("units.gallon") },
  ];
  const WEIGHT_UNITS = [
    { unit: "mg", label: t("units.mg") },
    { unit: "g", label: t("units.g") },
    { unit: "kg", label: t("units.kg") },
    { unit: "pound", label: t("units.pound") },
    { unit: "ounce", label: t("units.ounce") },
  ];
  const MISC_UNITS = [
    { unit: "can", label: t("units.can") },
    { unit: "pcs", label: t("units.pcs") },
    { unit: "pkg", label: t("units.pkg") },
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
