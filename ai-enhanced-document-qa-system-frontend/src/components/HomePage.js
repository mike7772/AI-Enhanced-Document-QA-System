import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Image, Input, Upload, message } from "antd";
import { RightOutlined } from "@ant-design/icons";
import ChatComponent from "./ChatComponent";
import { useSelector, useDispatch } from "react-redux";
import {
  addConvo,
  selectConversation,
} from "../state/features/conversationSlice";
import axios from "axios";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const HomePage = () => {
  const conversation = useSelector(selectConversation);
  const dispatch = useDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [startConvo, setStartConvo] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ file, fileList }) => {
    setFileList(fileList);

    // Check for upload status
    if (file.status === "done") {
      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === "error") {
      setStartConvo(false);
      message.error(`${file.name} file upload failed.`);
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    dispatch(addConvo({ text: inputValue, isUser: true }));
    if (fileList.length === 0 || !startConvo) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/documents/ask",
        {
          inputData: inputValue,
        }
      );
      dispatch(addConvo({ score:response.data.confidence, text: response.data.text, isUser: false }));
      setInputValue("");
      setIsLoading(false);
    } catch (error) {
      message.error("The server could not process your request..");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#fffff]">
        <header className="h-[6%] pt-2 pl-5 text-[17px]">AI-Enhanced Document QA System</header>
      <div className="h-[60%]">
        <ChatComponent conversation={conversation} />
      </div>
      <div className="h-[20%] flex justify-center">
        <div className="w-[50%] h-full mt-5">
          <div className="bg-[#00000]">
            <Upload
              className="bg-gray-100 p-2 rounded-lg border-2 border-dashed border-blue-500"
              action="http://localhost:5000/api/documents/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              accept=".pdf,.txt"
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </div>

          <div className="flex justify-between pt-5">
            <Input
              className="w-[90%]"
              placeholder="Question"
              value={inputValue}
              disabled={fileList.length === 0 || !startConvo}
              onChange={handleInputChange}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<RightOutlined />}
              size={"large"}
              disabled={
                fileList.length === 0 ||
                !startConvo ||
                inputValue !== "" ||
                isLoading
              }
              onClick={handleButtonClick}
            />
          </div>
          {fileList.length === 0 && <h3 className=" pt-1 pb-5 text-[#fc2340]">Please upload a file before interacting with the bot.</h3>}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
