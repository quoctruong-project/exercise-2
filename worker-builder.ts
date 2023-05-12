
import { IFileComputed, TextFile } from "./types";
export default () => {
  const ErrorMessage = {
    HAS_NUMBER:
      "File can only contain alphabet characters, it cannot contain numbers.",
    DIFFERENT_SYMBOL:
      "File can only contain the following special characters: (.) (,) ( ).",
    DIFFERENT_WORD: "File must contain at least 3 different words.",
  } as const;
  const { HAS_NUMBER, DIFFERENT_SYMBOL, DIFFERENT_WORD } = ErrorMessage;

  self.onmessage = (message) => {
    const file: File = message.data;
    if (file) {
      const textFile: TextFile = {
        name: "",
        size: 0,
        type: "",
        errors: [],
      };
      const fileReader = new FileReader();
      const blob = new Blob([file], { type: file.type });
      fileReader.onload = () => {
        /** Validate input file: Start*/
        const invalidChars = (fileReader.result as string).match(
          /[^.,\s\w{}[\]]|[\d]/g
        );
        let errors: string[] = [];
        if (invalidChars && invalidChars?.length > 0) {
          invalidChars.forEach((char) => {
            if (!isNaN(+char) && !errors.includes(HAS_NUMBER))
              errors.push(HAS_NUMBER);
            if (isNaN(+char) && !errors.includes(DIFFERENT_SYMBOL))
              errors.push(DIFFERENT_SYMBOL);
          });
        }
        const words = (fileReader.result as string)
          .trim()
          .toLowerCase()
          .split(/\s+/);
        const uniqueWords = new Set(words);
        if (uniqueWords.size < 3) errors.push(DIFFERENT_WORD);
        textFile.errors.push(...errors);
        /** Validate input file: End*/
        if (errors?.length > 0) {
          postMessage({ textFile });
        } else {
          /*Handle word statistics in file txt */
          const countMap = new Map();
          words.forEach((word) => {
            if (!countMap.has(word)) {
              countMap.set(word, 0);
            }
            countMap.set(word, countMap.get(word) + 1);
          });
          const sortedWords = [...countMap.entries()].sort(
            (a, b) => b[1] - a[1]
          );
          const topThreeWords = sortedWords.slice(0, 3);
          textFile.name = file.name;
          textFile.type = file.type;
          textFile.size = file.size;
          const computedData: IFileComputed = {
            textFile,
            topThreeWords,
            countWord: uniqueWords.size,
          };
          postMessage(computedData);
        }
      };
      fileReader.readAsText(blob);
    } else {
      postMessage(new Error("File is null or undefined."));
    }
  };
};
