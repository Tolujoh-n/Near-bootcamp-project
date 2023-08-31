use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    env,
    json_types::U64,
    near_bindgen,
    serde::Serialize,
    store::Vector,
    AccountId, BorshStorageKey, PanicOnDefault,
};

#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
#[near_bindgen]
pub struct Contract {
    messages: Vector<Message>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Message {
    id: u32,
    author: AccountId,
    block_height: U64,
    text: String,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    Messages,
}

#[near_bindgen]
impl Contract {
    #[init(ignore_state)]
    #[private]
    pub fn new() -> Self {
        Self {
            messages: Vector::new(StorageKey::Messages),
        }
    }

    #[private]
    pub fn clear(&mut self) {
        self.messages.clear();
    }

    #[payable]
    pub fn send(&mut self, text: String) {
        // require!(env::attached_deposit() > 0, "You must pay for storage.");

        // let storage_usage_start = env::storage_usage();

        let id = self.messages.len();

        let message = Message {
            author: env::predecessor_account_id(),
            block_height: env::block_height().into(),
            text,
            id,
        };

        self.messages.push(message);
        // self.messages.flush();

        // apply_storage_fee_and_refund(storage_usage_start, 0)
    }

    pub fn get_messages(&self, limit: Option<u32>, offset: Option<u32>) -> Vec<&Message> {
        self.messages
            .iter()
            .rev()
            .skip(offset.unwrap_or(0) as usize)
            .take(limit.unwrap_or(10) as usize)
            .collect()
    }
}