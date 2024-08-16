import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadImageToFirebase = async (uri, path) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const storage = getStorage();
        const storageRef = ref(storage, `${path}/${new Date().toISOString()}`);
        const snapshot = await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Erro ao fazer upload da imagem: ", error);
        throw error;
    }
};

export default uploadImageToFirebase;
