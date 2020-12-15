export default function sendMessage(channel, msg) {
  channel.send(msg).catch((err) => console.log(err));
}
