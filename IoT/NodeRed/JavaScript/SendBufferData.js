let status = flow.get("mqtt-status") || {};
let buffer =flow.get("buffer") || [];
if (status.fill =="green")
{
    while (buffer.length >0){
        node.log("Sending Buffering Data");
        let temp = buffer.pop();
        msg.payload=temp.payload;
        msg.topic=temp.topic;
        node.send(msg);
    }
}