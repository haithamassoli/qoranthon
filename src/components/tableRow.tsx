import { Box, ReText } from "@styles/theme";
import { vs } from "@utils/platform";

const TableRow = ({ title, value }: { title: string; value: string }) => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      borderColor="shadow"
      borderWidth={1}
    >
      <Box borderColor="shadow" flex={1} height={vs(38)}>
        <ReText
          variant="BodyMedium"
          fontFamily="Cairo-Bold"
          textAlign="center"
          lineHeight={vs(38)}
        >
          {title}
        </ReText>
      </Box>
      <Box borderColor="shadow" flex={1}>
        <ReText variant="BodyMedium" textAlign="center" lineHeight={vs(38)}>
          {value}
        </ReText>
      </Box>
    </Box>
  );
};

export default TableRow;
