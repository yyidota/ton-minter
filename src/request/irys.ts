import axios from "axios";

// export const uploadIrysImage = async (file: File) => {
//   debugger
//   const formData = new FormData();
//   formData.append('image', file);

//   console.log('File to upload:', file);
//   console.log('FormData content:', formData.get('image'));

//   for (let pair of formData.entries()) {
//     console.log(pair[0]+ ', ' + pair[1]);
//   }

//   try {
//       const response = await axios.post('https://slerf.tools/slerf-jup/upload-image', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       console.log('Image uploaded successfully:', response.data);

//       return response.data.url
//   } catch (error) {
//     return ''
//   }
// };
export const uploadIrysImage = async (file: File) => {
  if (!file) {
    console.error("No file provided for upload.");
    return "";
  }

  const formData = new FormData();
  formData.append("image", file);

  console.log("File to upload:", file);
  console.log("FormData content:", formData.get("image"));

  try {
    const response = await fetch("https://slerf.tools/slerf-jup/upload-image", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Image uploaded successfully:", data);
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return "";
  }
};

export const uploadIrysMetaData = async (metaData: any = {}) => {
  try {
    const res = await axios.post("https://slerf.tools/slerf-jup/upload-json", metaData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res.data);
    const resData = res.data;
    return {
      uri: resData.url,
      // cid: resData.IpfsHash,
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
    };
  }
};
