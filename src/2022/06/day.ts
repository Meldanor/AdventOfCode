function run(content: string[]): void {
  console.log(
    `(Part 1): The first start-of-packet marker is after '${findFirsStartOfPacketMarker(
      content[0],
      4
    )}' characters.`
  );
  console.log(
    `(Part 2): The first start-of-packet marker is after '${findFirsStartOfPacketMarker(
      content[0],
      14
    )}' characters.`
  );
}

function findFirsStartOfPacketMarker(
  packet: string,
  distinctChars: number
): number {
  const ringBuffer = [...packet.slice(0, distinctChars - 1)];

  for (let i = 3; i < packet.length; i++) {
    const element = packet[i];
    ringBuffer.push(element);

    if (new Set(ringBuffer).size === distinctChars) {
      console.log(`First Start of Packet Marker: ${ringBuffer}`);
      return i + 1;
    }
    ringBuffer.shift();
  }

  return -1;
}

export { run };
