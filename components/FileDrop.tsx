import { DeleteIcon } from "@/assets/icons";
import { images } from "@/assets/images";
import clsxm from "@/lib/clsxm";
import { IFileComputed, IFileDrop, WorkerBuilder } from "@/types";
import { isObjEmpty } from "@/utils";
import worker from "@/worker-builder";
import Image from "next/image";
import { DragEvent, useEffect, useRef, useState } from "react";
const myWorker = new WorkerBuilder(worker);

const FileDrop: React.FC<IFileDrop> = ({ onDrop }) => {
  const [drag, setDrag] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [file, setFile] = useState<IFileComputed>({} as IFileComputed);
  const { countWord, textFile, topThreeWords } = file || {};
  const { errors, name, size } = textFile || {};
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    myWorker.onmessage = ({ data }) => {
      setFile(data);
    };
  }, [file]);
  console.log("message", file);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const items = e?.dataTransfer?.items;
    if (items && items.length > 0) {
      return setDrag(true);
    }
  };
  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
  };
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    const { dataTransfer } = e;
    const files = dataTransfer?.files;
    if (files && files.length > 0) {
      if (files[0].type !== "text/plain") {
        setError("Only supported formats: TXT");
        setFile({} as IFileComputed);
      } else {
        setError("");
        myWorker.postMessage(files[0]);
        onDrop?.(files[0]);
        dataTransfer.clearData();
      }
    }
  };
  const onFileDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e?.target?.files?.[0];
    if (newFile) {
      myWorker.postMessage(newFile);
      setError("");
      onDrop?.(newFile);
    }
  };
  const fileRemove = () => {
    setError("");
    setFile({} as IFileComputed);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  const { wrapper, base, title, button, heading } = styles;
  return (
    <div className={wrapper}>
      <h2 className={heading}>Upload</h2>
      <div
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onDragLeave={handleDragOut}
        onDragEnter={handleDragIn}
        className={clsxm(drag ? "opacity-70" : "opacity-100", base)}
      >
        <Image
          width={120}
          height={120}
          alt="image-upload"
          src={images.upload}
          draggable={false}
          sizes="100vw"
          priority
          className="pointer-events-none"
        />
        <div className="flex gap-x-1  pointer-events-none">
          <p className={title}>Drag & drop files or</p>
          <input
            ref={inputRef}
            className="sr-only opacity-0"
            id="upload"
            type="file"
            accept="text/plain"
            onChange={onFileDrop}
          />
          <label
            className={clsxm(
              drag ? "pointer-events-none" : "pointer-events-auto",
              button
            )}
            role="button"
            htmlFor="upload"
          >
            Browse
          </label>
        </div>
        <p className="text-[#676767] pointer-events-none text-sm">
          Supported formats: TXT
        </p>
      </div>

      <ul className="text-red-500 list-inside list-disc text-sm mt-3">
        {error && <li>{error}</li>}
        {file?.textFile?.errors?.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      {!isObjEmpty(file as Object) && errors?.length == 0 && (
        <div className="mt-3">
          <div className="flex items-center border  bg-[#F8F8FF] pr-4 border-[#11AF22] rounded">
            <Image
              priority
              width={72}
              height={72}
              alt="image-file-txt"
              src={images.txt}
            />
            <div>
              <p className="text-lg font-medium">{name}</p>
              <p className="">{size} B</p>
            </div>
            <button
              onClick={fileRemove}
              className="ml-auto shadow-sm rounded-full  focus:outline-none"
            >
              <DeleteIcon />
            </button>
          </div>
          <div className="rounded border-green-500 px-3 py-3 mt-3 border ">
            <p>
              The total number of unique words in the text file is:{" "}
              <span className="text-orange-500  rounded  ">{countWord}</span>
            </p>
            <div className="mt-2">
              <span>
                The top 3 words in terms of frequency and their associated
                counts:
              </span>
              {topThreeWords?.map(([sword, count], index) => (
                <span
                  className=" inline-flex bg-gray-200 mb-2 text-purple-500 shadow-sm mx-2 text-center px-3 py-1 rounded gap-x-1 "
                  key={index}
                >
                  <p className="text-blue-500">{`${sword}`}</p>
                  {"-"}
                  <p className="text-orange-500">{count}</p>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDrop;

const styles = {
  heading: "text-black text-3xl font-semibold text-center mb-[30px]",
  wrapper:
    "max-w-[580px] w-screen h-full max-h-[620px] px-12 pt-8 pb-14 select-none rounded shadow-wrapper bg-white transition-all duration-200",
  base: "w-full z-50 relative max-h-[200px] bg-[#F8F8FF] border-[#384EB7]/30  border-dashed rounded border-2 pb-10 pt-5 flex justify-center flex-col items-center",
  title: "text-xl pointer-events-none font-medium text-center ",
  button:
    "text-xl cursor-pointer relative font-medium text-[#483EA8] mb-1 cursor-pointer duration-200 after:transition-[_width] after:bottom-0.5 after:block after:absolute after:w-0 hover:after:w-full after:h-0.5 after:bg-[#483EA8]",
};
