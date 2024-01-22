import { Box, ReText } from "@styles/theme";
import { width } from "@utils/helper";
import { BackHandler, TouchableOpacity, StyleSheet } from "react-native";
import { hs, isIOS, ms, vs } from "@utils/platform";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Canvas,
  Path,
  SkPath,
  Skia,
  TouchInfo,
  useTouchHandler,
} from "@shopify/react-native-skia";
import { Feather } from "@expo/vector-icons";
import ViewShot, { captureRef } from "react-native-view-shot";
import { HelperText, Modal, Portal, TextInput } from "react-native-paper";
import Colors from "@styles/colors";
import CustomButton from "@components/ui/customButton";
import { router, useLocalSearchParams } from "expo-router";
import { addSessionMutation } from "@apis/sessions";
import Loading from "@components/loading";
import { uploadImageMutation } from "@apis/uploadImage";
import SelectDropdown from "react-native-select-dropdown";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SearchSchemaType,
  ValidationSessionSchemaType,
  searchSchema,
  validationSessionSchema,
} from "@src/types/schema";
import { useQueryClient } from "@tanstack/react-query";
import ControlledInput from "@components/ui/controlledInput";
import Pdf from "react-native-pdf";
import { Asset } from "expo-asset";

type Color = "rgba(255,0,0,0.2)" | "rgba(255,223,154,0.4)";

type PathWithColor = {
  path: SkPath;
  color: Color;
};

// const source = isIOS
//   ? require("@assets/quran.pdf")
//   : { uri: "bundle-assets://quran.pdf", cache: true };
// : { uri: "file:///absolute/path/to/assets/quran.pdf", cache: true };
const renderActivityIndicator = () => <Loading />;

const QuranScreen = () => {
  const ref = useRef();
  const pdfRef = useRef<Pdf>(null);
  const queryClient = useQueryClient();

  const [paths, setPaths] = useState<PathWithColor[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [pathColor, setPathColor] = useState<Color>("rgba(255,0,0,0.2)");
  const [numErrs, setNumErrs] = useState(0);
  const [numPitfalls, setNumPitfalls] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visibleSearch, setVisibleSearch] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [pdfUri, setPdfUri] = useState<any>();
  const [ready, setReady] = useState(false);

  const {
    studentId,
  }: {
    studentId: string;
  } = useLocalSearchParams();

  const { control, handleSubmit } = useForm<ValidationSessionSchemaType>({
    resolver: zodResolver(validationSessionSchema),
  });

  const {
    control: searchControl,
    handleSubmit: searchHandleSubmit,
    reset,
    setError,
  } = useForm<SearchSchemaType>({
    resolver: zodResolver(searchSchema),
  });

  const { mutate: uploadImage, isLoading: isLoadingImage } =
    uploadImageMutation();
  const { mutate, isLoading } = addSessionMutation();

  const showModal = () => setVisible(true);
  const showSearchModal = () => setVisibleSearch(true);
  const hideModal = () => setVisible(false);
  const hideSearchModal = () => setVisibleSearch(false);

  const onEditingToggle = () => {
    if (isEditing) {
      if (paths.length > 0) {
        captureRef(ref, {
          quality: 0.3,
          format: "jpg",
        }).then((uri) => {
          setImages((prev) => [...prev, uri]);
          setPaths([]);
          setIsEditing(false);
        });
      } else {
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const onDrawingStart = useCallback(
    (touchInfo: TouchInfo) => {
      setPaths((old) => {
        const { x, y } = touchInfo;
        const newPath = Skia.Path.Make();
        newPath.moveTo(x, y);
        return [...old, { path: newPath, color: pathColor }];
      });
      if (pathColor === "rgba(255,0,0,0.2)") {
        setNumErrs((prev) => prev + 1);
      } else {
        setNumPitfalls((prev) => prev + 1);
      }
    },
    [pathColor]
  );

  const onDrawingActive = useCallback((touchInfo: TouchInfo) => {
    setPaths((currentPaths) => {
      const { x, y } = touchInfo;
      const currentPath = currentPaths[currentPaths.length - 1];
      const lastPoint = currentPath.path.getLastPt();
      const xMid = (lastPoint.x + x) / 2;
      const yMid = (lastPoint.y + y) / 2;

      currentPath.path.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
      return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
    });
  }, []);

  const touchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
    },
    [onDrawingActive, onDrawingStart]
  );

  const onEndSession = (data: ValidationSessionSchemaType) => {
    uploadImage(images, {
      onSuccess: (images) => {
        mutate(
          {
            numErrs,
            numPitfalls,
            createdAt: new Date(),
            images,
            studentId,
            sessionType: data.sessionType,
            sessionRate: data.sessionRate,
            werd: data.werd,
            notes: data.notes,
            points:
              data.sessionRate === "ممتاز"
                ? 3
                : data.sessionRate === "جيد جدا"
                ? 2
                : data.sessionRate === "جيد"
                ? 1
                : data.sessionRate === "مقبول"
                ? 0
                : -3,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(["sessions", studentId]);
              queryClient.invalidateQueries(["user", studentId]);
              setPaths([]);
              setIsEditing(false);
              setNumErrs(0);
              setNumPitfalls(0);
              hideModal();
              router.replace("/");
            },
          }
        );
      },
    });
  };

  const onSearch = (data: SearchSchemaType) => {
    if (isNaN(+data.search) || +data.search < 1 || +data.search > 604) {
      setError("search", {
        message: "يجب أن يكون البحث رقمًا بين 1 و 604",
        type: "custom",
        types: {
          custom: "يجب أن يكون البحث رقمًا بين 1 و 604",
        },
      });
      return;
    }
    pdfRef.current?.setPage(+data.search);
    reset();
    hideSearchModal();
  };

  const getPdf = async () => {
    setReady(false);
    const pdf = await Asset.loadAsync(require("@assets/quran.pdf"));
    setPdfUri({
      uri: pdf[0].localUri,
      cache: true,
    });
    setReady(true);
  };

  useEffect(() => {
    getPdf();
    const backAction = () => {
      showModal();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (ready === false) return <Loading />;

  return (
    <Box flex={1} backgroundColor="background">
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          {isLoading || isLoadingImage ? (
            <Box height={vs(180)}>
              <Loading />
            </Box>
          ) : (
            <>
              <ControlledInput
                control={control}
                name="werd"
                label="الورد"
                mode="outlined"
              />
              <Controller
                control={control}
                name="sessionType"
                rules={{
                  required: true,
                }}
                render={({
                  field: { onChange, onBlur },
                  fieldState: { error, invalid },
                }) => (
                  <>
                    <SelectDropdown
                      data={["جديد", "مراجعة"]}
                      onBlur={onBlur}
                      buttonStyle={{
                        width: "100%",
                        height: vs(48),
                        borderRadius: ms(8),
                        backgroundColor: Colors.background,
                        borderColor: error ? Colors.error : Colors.onBackground,
                        borderWidth: error ? 2 : 0.8,
                      }}
                      buttonTextStyle={{
                        textAlign: "left",
                        color: error ? Colors.error : Colors.onBackground,
                        fontFamily: "CairoBold",
                        fontSize: ms(14),
                      }}
                      defaultButtonText="نوع الجلسة"
                      dropdownStyle={styles.dropdown}
                      rowStyle={styles.row}
                      rowTextStyle={styles.rowText}
                      onSelect={onChange}
                      rowTextForSelection={(item, index) => item}
                    />
                    <HelperText
                      type="error"
                      visible={invalid}
                      style={styles.helperText}
                    >
                      {error?.message}
                    </HelperText>
                  </>
                )}
              />
              <Controller
                control={control}
                name="sessionRate"
                rules={{
                  required: true,
                }}
                render={({
                  field: { onChange, onBlur },
                  fieldState: { error, invalid },
                }) => (
                  <>
                    <SelectDropdown
                      data={["ممتاز", "جيد جدا", "جيد", "مقبول", "إعادة"]}
                      onBlur={onBlur}
                      buttonStyle={{
                        width: "100%",
                        height: vs(48),
                        borderRadius: ms(8),
                        backgroundColor: Colors.background,
                        borderColor: error ? Colors.error : Colors.onBackground,
                        borderWidth: error ? 2 : 0.8,
                      }}
                      buttonTextStyle={{
                        textAlign: "left",
                        color: error ? Colors.error : Colors.onBackground,
                        fontFamily: "CairoBold",
                        fontSize: ms(14),
                      }}
                      defaultButtonText="درجة الجلسة"
                      dropdownStyle={styles.dropdown}
                      rowStyle={styles.row}
                      rowTextStyle={styles.rowText}
                      onSelect={onChange}
                      rowTextForSelection={(item) => item}
                    />
                    <HelperText
                      type="error"
                      visible={invalid}
                      style={styles.helperText}
                    >
                      {error?.message}
                    </HelperText>
                  </>
                )}
              />
              <ControlledInput
                control={control}
                name="notes"
                label="ملاحظات"
                inputMode="text"
                textAlignVertical="top"
                contentStyle={styles.notesContent}
                multiline
                mode="outlined"
              />
              <Box flexDirection="row" justifyContent="space-around" gap="hl">
                <CustomButton
                  title="إلغاء الجلسة"
                  onPress={() => router.back()}
                  mode="text"
                  style={{
                    width: width / 3,
                  }}
                />
                <CustomButton
                  title="إنهاء الجلسة"
                  onPress={handleSubmit(onEndSession)}
                  style={{
                    width: width / 3,
                  }}
                />
              </Box>
            </>
          )}
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={visibleSearch}
          onDismiss={hideSearchModal}
          contentContainerStyle={styles.modal}
        >
          <Box>
            <ReText variant="TitleLarge" textAlign="center">
              بحث
            </ReText>
            <Box alignItems="center">
              <ControlledInput
                control={searchControl}
                name="search"
                placeholder="ادحل الصفحة المطلوبة"
                label="الصفحة"
                width={"98%"}
                right={
                  <TextInput.Icon
                    icon="magnify"
                    size={ms(24)}
                    onPress={searchHandleSubmit(onSearch)}
                  />
                }
              />
            </Box>
          </Box>
        </Modal>
      </Portal>
      <ViewShot
        // @ts-ignore
        ref={ref}
        style={{
          flex: 1,
        }}
      >
        <Box style={styles.rotatePdf}>
          <Pdf
            ref={pdfRef}
            horizontal
            trustAllCerts={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            enablePaging
            spacing={0}
            enableRTL
            maxScale={1}
            enableAnnotationRendering={false}
            enableAntialiasing={false}
            renderActivityIndicator={renderActivityIndicator}
            // source={source}
            source={pdfUri}
            // source={require("@assets/quran.pdf")}
            style={styles.pdfContainer}
          />
        </Box>
        {isEditing && (
          <Box
            position="absolute"
            width={width}
            height="100%"
            zIndex="aboveAll"
          >
            <Canvas style={{ flex: 1 }} onTouch={touchHandler}>
              {paths.map((path, index) => (
                <Path
                  key={index}
                  path={path.path}
                  color={path.color}
                  style={"stroke"}
                  strokeWidth={vs(30)}
                />
              ))}
            </Canvas>
          </Box>
        )}
      </ViewShot>
      {isEditing && (
        <Box
          position="absolute"
          flexDirection="row"
          zIndex="aboveAll"
          paddingHorizontal="hs"
          borderRadius="m"
          backgroundColor="primaryContainer"
          left={hs(16)}
          bottom={vs(16)}
        >
          <Box alignItems="center">
            <ReText variant="BodySmall">{`الأخطاء: ${numErrs}`}</ReText>
            <ReText variant="BodySmall">{`الترددات: ${numPitfalls}`}</ReText>
          </Box>
        </Box>
      )}
      <Box
        position="absolute"
        flexDirection="row"
        backgroundColor="primaryContainer"
        paddingHorizontal="hs"
        paddingVertical="vs"
        borderRadius="m"
        right={hs(16)}
        bottom={vs(16)}
        zIndex="aboveAll"
      >
        {isEditing && (
          <>
            <TouchableOpacity
              onPress={() => setPathColor("rgba(255,223,154,0.4)")}
              style={{
                marginHorizontal: hs(8),
              }}
            >
              <Box
                width={ms(20)}
                height={ms(20)}
                borderRadius="l"
                borderWidth={pathColor === "rgba(255,223,154,0.4)" ? 2 : 0}
                style={{
                  backgroundColor: "orange",
                  borderColor: "white",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPathColor("rgba(255,0,0,0.2)")}
              style={{ marginHorizontal: hs(8) }}
            >
              <Box
                width={ms(20)}
                height={ms(20)}
                borderRadius="l"
                borderWidth={pathColor === "rgba(255,0,0,0.2)" ? 2 : 0}
                style={{
                  backgroundColor: "rgba(255,0,0,0.6)",
                  borderColor: "white",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (paths.length === 0) return;
                const lastPath = paths[paths.length - 1];
                setPaths((prev) => prev.slice(0, prev.length - 1));
                if (lastPath.color === "rgba(255,0,0,0.2)") {
                  setNumErrs((prev) => prev - 1);
                } else {
                  setNumPitfalls((prev) => prev - 1);
                }
              }}
            >
              <Feather
                name="rotate-ccw"
                size={ms(20)}
                color="rgb(120, 90, 0)"
              />
            </TouchableOpacity>
          </>
        )}
        {!isEditing && (
          <TouchableOpacity
            onPress={showSearchModal}
            style={{ marginLeft: hs(8) }}
          >
            <Feather name={"search"} size={ms(20)} color="rgb(120, 90, 0)" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onEditingToggle}
          style={{ marginLeft: hs(8) }}
        >
          <Feather
            name={isEditing ? "check" : "edit-3"}
            size={ms(20)}
            color="rgb(120, 90, 0)"
          />
        </TouchableOpacity>
        {!isEditing && (
          <TouchableOpacity onPress={showModal} style={{ marginLeft: hs(8) }}>
            <Feather name={"log-out"} size={ms(20)} color="rgb(120, 90, 0)" />
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  );
};

export default QuranScreen;

const styles = StyleSheet.create({
  pdfContainer: {
    flex: 1,
    width,
    height: "100%",
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Colors.background,
    paddingVertical: vs(16),
    paddingHorizontal: hs(16),
    marginHorizontal: hs(16),
    borderRadius: ms(12),
  },
  dropdown: {
    borderRadius: ms(8),
    backgroundColor: Colors.background,
    borderColor: Colors.onBackground,
    borderWidth: 0.8,
  },
  row: {
    width: "100%",
    backgroundColor: Colors.background,
    borderColor: Colors.onBackground,
    borderWidth: 0.6,
  },
  helperText: {
    fontFamily: "CairoReg",
    textAlign: "left",
    width: "100%",
  },
  rowText: {
    fontFamily: "CairoReg",
    fontSize: ms(14),
    textAlign: "left",
    color: Colors.onBackground,
  },
  notesContent: {
    height: vs(156),
  },
  rotatePdf: {
    flex: 1,
    transform: [{ rotate: isIOS ? "0deg" : "180deg" }],
  },
});
