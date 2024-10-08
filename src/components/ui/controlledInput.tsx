import Colors from "@styles/colors";
import { ms, vs } from "@utils/platform";
import { Controller, Control } from "react-hook-form";
import { StyleSheet } from "react-native";
import { TextInput, HelperText } from "react-native-paper";

type ControlledInputProps = {
  control: Control<any>;
  name: string;
  width?: any;
  defaultValue?: string;
  noError?: boolean;
} & React.ComponentProps<typeof TextInput>;

const ControlledInput = ({
  control,
  name,
  width,
  defaultValue,
  noError = false,
  ...textInputProps
}: ControlledInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error, invalid },
      }) => (
        <>
          <TextInput
            contentStyle={styles.inputContent}
            {...textInputProps}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={invalid}
          />
          {!noError && (
            <HelperText
              type="error"
              visible={invalid}
              style={[
                styles.helperText,
                {
                  width: width || "86%",
                },
              ]}
            >
              {error?.message}
            </HelperText>
          )}
        </>
      )}
    />
  );
};

export default ControlledInput;

const styles = StyleSheet.create({
  helperText: {
    fontFamily: "Cairo-Regular",
    textAlign: "left",
    width: "86%",
  },
  input: {
    width: "100%",
    height: vs(48),
    fontFamily: "Cairo-Bold",
    fontSize: ms(14),
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    lineHeight: ms(24),
  },
  inputContent: {
    fontFamily: "Cairo-Regular",
    fontSize: ms(14),
    height: vs(48),
  },
  inputOutline: {
    borderRadius: ms(8),
  },
});
