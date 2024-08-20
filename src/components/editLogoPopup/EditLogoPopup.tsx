import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { AppButton } from "components/appButton";
import { Popup } from "components/Popup";
import { PopupContent, PopupDescription, PopupTitle } from "components/editLogoPopup/styled";
import { useJettonLogo } from "hooks/useJettonLogo";

interface EditLogoPopupProps {
  showPopup: boolean;
  tokenImage: any;
  close: () => void;
  showExample?: boolean;
}

export const EditLogoPopup: React.FC<EditLogoPopupProps> = ({
  showPopup,
  tokenImage,
  showExample,
  close,
}) => {
  const { jettonLogo, setLogoUrl, setLogoFile } = useJettonLogo();
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    setFile(null); // Reset file state when popup is reopened
  }, [showPopup]);

  const handleSave = () => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setLogoFile(file);
      setLogoUrl(fileUrl); // Save the image URL
      close();
    }
  };

  return (
    <Popup open={showPopup} onClose={close} maxWidth={644}>
      <PopupTitle>Edit logo</PopupTitle>
      <Box sx={{ width: "100%" }}>
        <PopupContent>
          <div
            {...getRootProps()}
            style={{ border: "2px dashed #0088CC", padding: "20px", cursor: "pointer" }}>
            <input {...getInputProps()} />
            {!file ? (
              <p>Drag 'n' drop an image here, or click to select one</p>
            ) : (
              <p>{file.name}</p>
            )}
          </div>
        </PopupContent>
        <PopupDescription>{tokenImage.description}</PopupDescription>
        <Box>
          <AppButton
            disabled={!file}
            height={44}
            width={118}
            fontWeight={700}
            type="button"
            onClick={handleSave}
            background="#0088CC">
            Save Image
          </AppButton>
        </Box>
      </Box>
    </Popup>
  );
};
