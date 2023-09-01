import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { UserList } from "./";
import { CloseCreateChannel } from "../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUsers } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const ChannelNameInput = ({ channelName = "", setChannelName }) => {
  const handleChange = (e) => {
    e.preventDefault();
    setChannelName(e.target.value);
  };

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input
        value={channelName}
        onChange={handleChange}
        placeholder="Channel-Name"
      />
      <FontAwesomeIcon className="icon" icon={faUsers} />
      <p>Add Members</p>
    </div>
  );
};

const CreateChannel = ({ createType, setIsCreating }) => {
  const { client, setActiveChannel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client.userID || ""]);
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);

  const createChannel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName,
        members: selectedUsers,
      });
      await newChannel.watch();
      setChannelName("");
      setIsCreating(false);
      setSelectedUsers([client.userID]);
      setActiveChannel(newChannel);
      setLoading(false);
      toast.success("Voila! Your channel is created successfully.");
    } catch (error) {
      setLoading(false);
      toast.error(
        "Uh-oh! We encountered an issue. Please make sure there are no spaces in your input."
      );
    }
  };

  return (
    <div className="create-channel__container">
      <div className="create-channel__header">
        <p>
          {createType === "team"
            ? "Create a New Channel"
            : "Send a Direct Message"}
        </p>
        <CloseCreateChannel setIsCreating={setIsCreating} />
      </div>
      {createType === "team" && (
        <ChannelNameInput
          channelName={channelName}
          setChannelName={setChannelName}
        />
      )}
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className="create-channel__button-wrapper" onClick={createChannel}>
        <p>
          {loading ? (
            <FontAwesomeIcon
              icon={faGear}
              size="lg"
              spin
              style={{ color: "#ffffff" }}
            />
          ) : createType === "team" ? (
            "Create Channel"
          ) : (
            "Create Message Group"
          )}
        </p>
      </div>
    </div>
  );
};

export default CreateChannel;
