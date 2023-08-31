import React, { useState, useEffect } from 'react';
import { Widget, Near } from '@near-eth/global-chat';
import styled from 'styled-components';

// Styled components for styling
const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;

const PostContainer = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 10px;
`;

const Post = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const PostText = styled.p`
  font-size: 16px;
  margin: 0;
`;

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const contractAccountId = 'ece61a112fbb05b5ff96fd4d63cb259c4bae966477829666d46ddc4e5121d801'; // I'm actaully facing some error with deploying my smart contract contract so i'm using jacobs contract
      const result = await Near.view(contractAccountId, 'get_messages', {
        limit: 10,
      });

      setMessages(result);
    }

    fetchMessages();
  }, []);

  return (
    <Container>
      {messages.map((message) => (
        <PostContainer key={message.id}>
          <Post>
            <Avatar src="avatar-url" alt="User Avatar" />
            <PostText>{message.text}</PostText>
          </Post>
          <Widget
            src="tolujohn.near/widget/AccountProfile"
            props={{
              accountId: message.author,
            }}
          />
          <Widget
            src="andyh.near/widget/TimeAgo"
            props={{
              blockHeight: message.block_height,
            }}
          />
        </PostContainer>
      ))}
    </Container>
  );
}

export default App;
