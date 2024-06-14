import { Trans } from "react-i18next";
import { Banner } from "react-native-paper";
import { theme } from "../theme";

export default function ErrorFormMessage() {
  return (
    <Banner
      visible={true}
      theme={theme}
      style={{
        flex: 1,
        borderColor: theme.colors.dangerBackground,
        borderRadius: 5,
        borderWidth: 2,
        marginBottom: 20,
      }}
    >
      <Trans i18nKey="errors.form.message" />
    </Banner>
  );
}
