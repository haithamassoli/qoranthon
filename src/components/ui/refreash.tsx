import Colors from "@styles/colors";
import { RefreshControl } from "react-native";

const Refresh = ({
  isFetching,
  refetch,
}: {
  isFetching: boolean;
  refetch: () => void;
}) => {
  return (
    <RefreshControl
      refreshing={isFetching}
      onRefresh={refetch}
      colors={[Colors.primary]}
      progressBackgroundColor={Colors.background}
      tintColor={Colors.primary}
    />
  );
};

export default Refresh;
