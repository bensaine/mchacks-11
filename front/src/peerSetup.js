import { Peer } from "peerjs";
import { useState } from "react";
const CONFIG = {
  iceServers: [
    { urls: "stun:freeturn.net:5349" },
    { urls: "turns:freeturn.tel:5349", username: "free", credential: "free" },
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:standard.relay.metered.ca:80",
      username: "029652132a7e928e1284d2a4",
      credential: "RRlS3CPweEpesTiJ",
    },
    {
      urls: "turn:standard.relay.metered.ca:80?transport=tcp",
      username: "029652132a7e928e1284d2a4",
      credential: "RRlS3CPweEpesTiJ",
    },
    {
      urls: "turn:standard.relay.metered.ca:443",
      username: "029652132a7e928e1284d2a4",
      credential: "RRlS3CPweEpesTiJ",
    },
    {
      urls: "turns:standard.relay.metered.ca:443?transport=tcp",
      username: "029652132a7e928e1284d2a4",
      credential: "RRlS3CPweEpesTiJ",
    },
  ],
};
class PeerHelper {
  constructor(id) {
    this.id = id;
    this.peer = new Peer(id, CONFIG);
    this.calls = {};
    this.init();
    this.getStream();
    this.selfStream = null;
  }
  bindSetters = (streamSetter, selfStreamSetter) => {
    this.setStreams = (a) => {
      streamSetter(a);
    };
    this.selfStream = (a) => selfStreamSetter(a);
  };

  bindSetLoader(setter) {
    this.setDone = setter;
  }

  contacting(otherId) {
    return otherId in this.calls;
  }

  async getStream() {
    // if (this.selfStream !== null){
    //     return this.selfStream
    // }
    try {
      console.log("getting navigator stream");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.selfStream = stream;
      this.setDone();
      return stream;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  setAudio(mode) {
    this.selfStream.getAudioTracks()[0].enabled = mode;
  }
  setVideo(mode) {
    this.selfStream.getVideoTracks()[0].enabled = mode;
  }

  removePeer(peerId) {
    delete this.calls[peerId]
    this.setStreams((prev) => {
      const copy = Object.assign({}, prev);
      delete copy[peerId];
      return copy;
    });
  }

  addStream(peerId, stream) {
    this.setStreams((prev) => {
      const copy = Object.assign({}, prev, { [peerId]: stream });
      return copy;
    });
  }

  close(peerId) {
    if (peerId in this.calls && this.calls[peerId]){
        this.calls[peerId].close();
        this.removePeer(peerId);
    }
  }

  async call(peerId) {
    const stream = this.selfStream;
    console.log(`calling peer ${peerId}`);
    const callElement = this.peer.call(peerId, stream);
    this.calls[peerId] = callElement;
    callElement.on("stream", (remoteStream) => {
      this.addStream(peerId, remoteStream);
    });
    callElement.on("close", () => {
      this.removePeer(peerId);
    });
  }

  init() {
    this.peer.on("call", (call) => {
      const stream = this.selfStream;
      call.answer(stream);
      this.calls[call.peer] = call;
      call.on("stream", (remoteStream) => {
        this.addStream(call.peer, remoteStream);
      });
      call.on("close", () => {
        this.removePeer(call.peer);
      });
    });
  }
}

export const usePeerHelper = () => {
  const [streams, setStreams] = useState({});
  const [loadedWebcam, setLoadedWebcam] = useState(false);
  const createPeerHelper = (id) => {
    const peerHelper = new PeerHelper(id);
    peerHelper.bindSetLoader(() => {
      setLoadedWebcam(true);
    });
    peerHelper.bindSetters(setStreams);
    return peerHelper;
  };
  return { createPeerHelper, streams, loadedWebcam };
};
