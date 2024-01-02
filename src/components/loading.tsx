import { ActivityIndicator } from "react-native-paper";

interface LoadingProps {
  size?: "small" | "large";
}

const Loading = ({ size }: LoadingProps) => {
  return <ActivityIndicator style={{ flex: 1 }} size={size || "large"} />;
};

export default Loading;
