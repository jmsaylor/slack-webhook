app.post('/showlibrary', async (req, res) => {

    const books = await Book.find();

    //blocks is the container for messages how Slack likes it
    const blocks = [ 
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "School Library"
            }
        }
    ];

    books.forEach((book) => {

        blocks.push({
            type: "divider"
        });

        blocks.push({
            type: "section", 
            text: {
                type: "mrkdwn",
                text: book.title
            },
            accessory: {
                type: "image",
                image_url: "https://images-na.ssl-images-amazon.com/images/I/41-+g1a2Y1L._SX375_BO1,204,203,200_.jpg",
                alt_text: "Photo of Book Cover"
            }
        });

        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: book.currentOwner
            }
        });

        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: "Request transfer from current owner"
            },
            accessory: {
                // can add a url for redirect after click
                type: "button",
                text: {
                    type: "plain_text",
                    text: "Checkout",
                    emoji: true
                },
                value: book.title,
                action_id: "checkout" + (Math.floor(Math.random() * 1000)) //TODO: better id system
            }
        });
    });
        
    try {
        await bolt.client.chat.postMessage({
            token: process.env.SLACK_TOKEN,
            channel: req.body.channel_id,
            blocks: blocks
        })
        res.json();
    } catch (error) {
        console.log(error);
    }
})