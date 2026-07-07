// This manages presence, not document content.
// Think Google Docs people who are present in the document.
// Nothing in here gets stored permanently. If everyone disconnects everything disappears.
export const onConnect = async () => {
    console.log("Client connected");
};

export const onDisconnect = async () => {
    console.log("Client disconnected");
};