import { Box, ReText } from "@styles/theme";
import { dateFromNow } from "@utils/helper";

interface Props {
  title: string;
  body: string;
  date: Date;
}

const NotificationCard = ({ body, title, date }: Props) => {
  return (
    <Box
      borderLeftWidth={4}
      borderColor="primary"
      paddingStart="hs"
      backgroundColor="surfaceVariant"
      paddingVertical="vm"
      paddingHorizontal="hm"
      borderRadius="m"
    >
      <Box flexDirection="row" justifyContent="space-between">
        <ReText variant="BodySmall" textAlign="left">
          {title}
        </ReText>
        <ReText variant="BodySmall" textAlign="left">
          {dateFromNow(date)}
        </ReText>
      </Box>
      <ReText
        variant="TitleMedium"
        textAlign="left"
        fontFamily="CairoBold"
        color="primary"
      >
        {body}
      </ReText>
    </Box>
  );
};

export default NotificationCard;
