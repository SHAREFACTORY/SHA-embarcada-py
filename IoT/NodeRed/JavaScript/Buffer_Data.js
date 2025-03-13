let status = flow.get("mqtt-status") || {};
let buffer = flow.get("buffer") || [];
if (status.fill =="green")
    return msg;
else
{
    node.log("buffering data");
    if (buffer.length<20)
    {
        buffer.push({"payload":msg.payload,"topic":msg.topic});
        flow.set("buffer",buffer); //Armazena as informações e tenta reenviar
    }
}