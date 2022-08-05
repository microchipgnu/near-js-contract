import { NearContract, NearBindgen, call, view, near, LookupMap, bytes, assert } from 'near-sdk-js'
import { Serializer } from 'superserial';

// 

class Post {
    id: string
    content: string
    creator_id: string
    likes: number

    constructor(id: string, content: string, creator_id: string) {
        this.content = content;
        this.creator_id = creator_id;
        this.likes = 0;
    }
}

@NearBindgen
class Wall extends NearContract {

    posts_counter: number
    owner_by_id: LookupMap<string, Post>

    constructor() {
        super()
        this.owner_by_id = new LookupMap("owner_by_id_prefix")
    }

    deserialize(): void {
        super.deserialize()
        // @ts-ignore
        this.owner_by_id.serializer = new Serializer()
        // @ts-ignore
        this.owner_by_id = Object.assign(new LookupMap, this.owner_by_id)
    }


    @call
    createPost({ content }) {
        let sender_id = near.predecessorAccountId()
        this.posts_counter += 1

        let new_post_id = (this.posts_counter).toString()

        const post = new Post(new_post_id, content, sender_id)

        this.owner_by_id.set(new_post_id, post)

        return post
    }
}