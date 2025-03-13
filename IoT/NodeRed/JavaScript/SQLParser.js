//Call main Function parsing msg
main(msg);

// Function node main handler
function main(msg) {
    // Check if msg.payload is defined and not empty
    if (msg.payload) {
        // Process the payload
        processPayload(msg.payload);
    }

    // Return the original message for debugging purposes
    return msg;
}

// Function to handle the incoming message payload
function processPayload(payload) {
    //Initialize context to store last values for topics, if there's any, it will be empty instead of full
    let lastValues = context.get('lastValues') || {};

    // Check if payload is an array
    if (Array.isArray(payload)) {

        // Iterate over the array of objects
        payload.forEach(obj => {

            // Iterate over the keys (topics) in each object
            Object.keys(obj).forEach(topic => {

                // Extract data object for the current topic
                const dataObj = obj[topic];

                // Extract necessary values from the data object
                const timestamp = dataObj.timestamp || 0;
                const value = dataObj.value;
                const topicName = dataObj.topic || '';

                // Initialize last value for the topic if not already set
                if (!lastValues.hasOwnProperty(topic)) {
                    lastValues[topic] = null;
                }

                //Check if there's a valid value before send  
                if (value !== null) {
                    const lastValue = lastValues[topic];
                    const difference = Math.abs(value - lastValue);

                    if (lastValue === null || difference > 0.1) {

                        // Convert Unix timestamp to milliseconds and create a Date object
                        const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

                        // Format the datetime string as 'YYYY-MM-DD HH:MM:SS'
                        const formattedTimestamp = date.toISOString().slice(0, 19).replace('T', ' ');

                        // Construct the SQL query with the formatted timestamp
                        const query = `INSERT INTO PLCv1 (timestamp, value, topic) VALUES ('${formattedTimestamp}', '${value}', '${topic}');`

                        // Send debug message before sending the SQL query
                        node.warn(`Sending SQL query: ${query}`);

                        // Send the query to the connected MySQL node
                        node.send({
                            topic: query, // Set the query as the topic
                            payload: [formattedTimestamp, value, topic] // Pass values as an array in payload
                        });
                    } else {
                        // Value difference is not significant, do not send to MySQL query node
                        node.warn(`Skipping value for topic '${topic}' due to insignificant difference`);
                    }
                    lastValues[topic] = value;
                } else {
                    node.warn("Skipping null value for topic: " + topic);
                }
                // Update last value for the topic
          
            });
        });
    }
    // Save updated lastValues to context
    context.set('lastValues', lastValues);
}