import React, { useEffect } from "react";
import { Channel, useChatContext, MessageSimple } from "stream-chat-react";
import { ChannelInner, CreateChannel, EditChannel } from "./";
import lottie from "lottie-web/build/player/lottie_light";
import channelListEmptyState from "../assets/static/channelListEmptyState.json";

const EmptyState = () => {
  useEffect(() => {
    const container = document.getElementById("lottie-container");

    const animationOptions = {
      container: container,
      animationData: channelListEmptyState,
      loop: true,
      autoplay: true,
      rendererSettings: {
        animationSpeed: 0.5,
      },
    };

    const anim = lottie.loadAnimation(animationOptions);

    return () => {
      anim.destroy();
    };
  }, []);

  return (
    <div className="channel-empty__container">
      <div className="channel-empty__content-centered">
        <div
          id="lottie-container"
          style={{ width: "500px", height: "500px" }}
        ></div>
        <div className="channel-empty__text-offset">
          <p className="channel-empty__first">
            This is the beginning of your chat history
          </p>
          <p className="channel-empty__second">
            Send messages, attachments, links, emojis, and more!
          </p>
        </div>
      </div>
    </div>
  );
};

const ChannelContainer = ({
  isCreating,
  setIsCreating,
  isEditing,
  setIsEditing,
  createType,
}) => {
  const { channel } = useChatContext();

  if (isCreating) {
    return (
      <div className="channel__container">
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="channel__container">
        <EditChannel setIsEditing={setIsEditing} />
      </div>
    );
  }

  return (
    <div className="channel__container">
      <Channel
        EmptyStateIndicator={EmptyState}
        Message={(messageProps, i) => (
          <MessageSimple key={i} {...messageProps} />
        )}
      >
        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </div>
  );
};

export default ChannelContainer;
