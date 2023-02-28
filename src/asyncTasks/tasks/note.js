// import { saveNoteRequest, deleteNoteRequest } from '@services/notes';
// import { User_Notes } from '@indexedDB/notes';
import { isObject, isUndefined } from 'lodash';

const saveNote = async (taskInfo) => {
    const note = await User_Notes.get(taskInfo.payload);
    return new Promise ((resove, reject) => {
        if (isUndefined(note) || !isObject(note)) {
            resove();
        }
        saveNoteRequest({ ...note }).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    resove(resp);
                } else {
                    reject();
                }
            },
            error: () => {
                reject();
            },
        });
    });
};

const deleteNote = async (taskInfo) => {
    return new Promise ((resove, reject) => {
        deleteNoteRequest({ notes_id: taskInfo.payload }).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    resove(resp);
                } else {
                    reject();
                }
            },
            error: () => {
                reject();
            },
        });
    });
};

export default {
    SAVE: saveNote,
    DELETE: deleteNote,
};
