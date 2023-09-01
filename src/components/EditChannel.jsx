import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { UserList } from "./";
import { CloseCreateChannel } from "../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCalendarCheck,
  faGear,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

const ChannelNameInput = ({
  channelName = "",
  setChannelName,
  channelData,
}) => {
  const handleChange = (e) => {
    e.preventDefault();
    setChannelName(e.target.value);
  };

  const formatDate = (date) => {
    const dateTimeString = date;
    const dateTime = new Date(dateTimeString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    const formattedDateTime = dateTime.toLocaleDateString("en-US", options);
    return formattedDateTime;
  };

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input
        value={channelName}
        onChange={handleChange}
        placeholder="channel-name"
      />
      <FontAwesomeIcon className="icon" icon={faUsers} />
      <p>Channel Information</p>
      <div className="channel-information__wrapper">
        <div className="channel-information">
          <div>
            <FontAwesomeIcon
              className="channel-information__icon"
              icon={faUser}
            />
          </div>
          <span>Created By: {channelData?.data?.created_by.name} </span>
        </div>
        <br />
        <div className="channel-information">
          <div>
            <FontAwesomeIcon
              className="channel-information__icon"
              icon={faUsers}
            />
          </div>
          <span>Member Count: {channelData?.data?.member_count} </span>
        </div>
        <br />
        <div className="channel-information">
          <div>
            <FontAwesomeIcon
              className="channel-information__icon"
              icon={faCalendarAlt}
            />
          </div>
          <span>Created At: {formatDate(channelData?.data?.created_at)} </span>
        </div>
        <br />
        <div className="channel-information">
          <div>
            <FontAwesomeIcon
              className="channel-information__icon"
              icon={faCalendarCheck}
            />
          </div>
          <span>Updated At: {formatDate(channelData?.data?.updated_at)}</span>
        </div>
      </div>
      <p>Add Members</p>
    </div>
  );
};

const EditChannel = ({ setIsEditing }) => {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateChannel = async (e) => {
    e.preventDefault();
    const nameChanged = channelName !== (channel.data.name || channel.data.id);
    try {
      setLoading(true);
      if (nameChanged) {
        await channel.update(
          { name: channelName },
          { text: `Channel name changed to ${channelName}` }
        );
      }
      if (selectedUsers.length) {
        await channel.addMembers(selectedUsers);
      }
      setChannelName(null);
      setIsEditing(false);
      setSelectedUsers([]);
      setLoading(false);
      toast.success(
        "Your channel settings have been updated with the changes you made."
      );
    } catch (error) {
      setLoading(false);
      toast.error(
        "There was an error updating your channel settings. Please double-check your input and attempt again."
      );
    }
  };

  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Edit Channel</p>
        <CloseCreateChannel setIsEditing={setIsEditing} />
      </div>
      <ChannelNameInput
        channelName={channelName}
        setChannelName={setChannelName}
        channelData={channel}
      />
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className="edit-channel__button-wrapper" onClick={updateChannel}>
        <p>
          {loading ? (
            <FontAwesomeIcon
              icon={faGear}
              size="lg"
              spin
              style={{ color: "#ffffff" }}
            />
          ) : (
            "Save Changes"
          )}
        </p>
      </div>
    </div>
  );
};

export default EditChannel;
