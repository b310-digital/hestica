import { StyleSheet } from "react-native";
import { theme } from "../theme";

export const dropDownStyles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 15,
    marginBottom: 10,
    marginRight: 10,
    flexGrow: 1,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    paddingLeft: 10,
  },
  addButton: {
    marginBottom: 10,
  },
});

export const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  ingredients: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    paddingBottom: 10,
  },
  instructions: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  inputSplitted: {},
  inputSplittedEnd: {
    marginStart: 5,
  },
  inputSplittedStart: {
    marginEnd: 5,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeImageFont: {
    color: theme.colors.onSecondaryContainer,
  },
  margin: {
    marginBottom: 10,
  },
});
