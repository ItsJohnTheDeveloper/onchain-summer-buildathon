# Verdict App

## What is Verdict?

Verdict is an innovative application designed to settle disputes in a unique and engaging way. It allows users to create prompts related to their disputes, inviting others to provide their perspectives or solutions. The core of Verdict's functionality lies in its integration with OAO AI, which analyzes the responses to determine the most suitable solution, effectively settling the dispute.

Upon the resolution of a dispute, Verdict showcases the winning answer, bringing closure to the matter at hand. To further incentivize participation and reward the winning contributions, Verdict integrates with the Crossmint Client SDK, enabling the distribution of NFTs to winners. This not only provides a tangible reward for their insightful contributions but also encourages a healthy and constructive environment for resolving conflicts.

## Tech Demo

1. **User Login**: Users start by logging in via Stytch. They receive a magic link in their email.
2. **Email Verification**: Clicking the magic link redirects users to the authentication page.
3. **Account Creation & Registration**: After authentication, the user's account is created in the backend, and they are redirected to the `/register` page.
4. **Smart Wallet Generation**: On the registration page, users can generate a smart wallet using the Crossmint Client SDK. They sign in using their passkey.
5. **Wallet Association**: Once signed, a wallet address string is assigned to their user profile in the database.
6. **Home Page Redirection**: After registering for a smart wallet, users are redirected to the home page.
7. **Room Creation**: Users can create a room by specifying a prompt or question and invite others via email.
8. **Inviting Participants**: Invited participants receive a magic link in their email, redirecting them to the register page to create their smart wallet.
9. **Joining the Room**: After wallet creation, participants can join the room and respond to the prompt.
10. **Submitting Responses for Analysis**: Once more than one user has responded, the host submits these for AI analysis.
11. **AI Analysis**: The AI analyzes all responses, determining the most suitable or creative answer.
12. **Blockchain Transaction**: The context of the room (answers, prompt, and user IDs) is signed in a smart contract and recorded on the blockchain.
13. **Displaying Results**: All users see the results, with the winner and winning answer highlighted.
14. **NFT Reward**: The winner receives an NFT as a reward, with a link to view the transaction details on Optimism.

### Screenshots of the Winner:

![Screenshot from 2024-07-07 23-57-49](https://github.com/ItsJohnTheDeveloper/onchain-summer-buildathon/assets/40045461/967560d4-c085-491c-8959-7d0070e0bdb8)

### Screenshot of the Winner's NFT transaction:

![Screenshot from 2024-07-07 23-59-16](https://github.com/ItsJohnTheDeveloper/onchain-summer-buildathon/assets/40045461/2b93de58-30d8-466a-b75e-4e5bad5ed392)

### Screenshot of the Room details that are stored on the blockchain:

![Screenshot from 2024-07-08 00-04-48](https://github.com/ItsJohnTheDeveloper/onchain-summer-buildathon/assets/40045461/46f9d7b7-a446-455e-87bc-b49d635f8427)

## Key Features & Technologies

- **nfts**: The winner of the dispute is rewarded with an NFT.
- **seemless wallet creation**: Users can create a smart wallet with ease via the Crossmint Client SDK to reward winners with NFTs.
- **passkeys**: Users can create smart wallets with passkeys for added security.
- **ORA**: AI analyzes the dispute thanks to ORA to determine the most suitable solution and the output is verifiable onchain thanks to ORA's AI onchain oracle.
