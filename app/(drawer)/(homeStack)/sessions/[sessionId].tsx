import { getSessionByIdQuery } from "@apis/sessions";
import { Box } from "@styles/theme";
import { dayInWeek } from "@utils/helper";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PhotoView, { Photo } from "@merryjs/photo-viewer";
import { useState } from "react";
import CustomButton from "@components/ui/customButton";
import TableRow from "@components/tableRow";
import Header from "@components/header";
import Loading from "@components/loading";

const SessionScreen = () => {
  const {
    studentId,
    sessionId,
  }: {
    studentId: string;
    sessionId: string;
  } = useLocalSearchParams();

  const [isVisible, setIsVisible] = useState(false);
  const { data, isInitialLoading: isLoading } = getSessionByIdQuery(
    studentId,
    sessionId
  );

  if (isLoading) return <Loading />;

  const date = new Date(data?.createdAt!);
  const day = date.getDate();
  const month = date.getMonth();

  // @ts-ignore
  const images: Photo[] = data?.images?.map((image) => ({
    source: {
      uri: image,
    },
  }));

  return (
    <SafeAreaView>
      <Header title="الجلسة" />
      <Box paddingHorizontal="hm" paddingTop="v2xl">
        <PhotoView
          visible={isVisible}
          data={images}
          hideStatusBar={true}
          initial={0}
          onDismiss={() => setIsVisible(false)}
        />
        <TableRow
          title="جلسة"
          value={`${dayInWeek(data?.createdAt!)} (${month}/${day})`}
        />
        <TableRow title="الورد" value={data?.werd!} />
        <TableRow title="نوع الجلسة" value={data?.sessionType!} />
        <TableRow title="تقييم الجلسة" value={data?.sessionRate!} />
        <TableRow title="عدد الأخطاء" value={data?.numErrs?.toString()!} />
        <TableRow title="عدد الترددات" value={data?.numPitfalls?.toString()!} />
        <TableRow
          title="الملاحظات"
          value={data?.notes!?.length > 0 ? data?.notes! : "لا يوجد ملاحظات"}
        />
        <Box marginVertical="vm" />
        <CustomButton
          title="عرض الأخطاء والترددات"
          onPress={() => setIsVisible(true)}
        />
      </Box>
    </SafeAreaView>
  );
};

export default SessionScreen;
