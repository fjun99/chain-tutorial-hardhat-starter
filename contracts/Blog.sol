// contracts/Blog.sol
//SPDX-License-Identifier: Unlicense

// Attribution: sample code adapted from this guide
// Title : The Complete Guide to Full Stack Web3 Development
// Author: Nader Dabit
// Date  : 2022-2-10
// Github: https://github.com/dabit3/full-stack-web3

// What do we change here: store content hash on chain instead of string

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Blog {
    string public name;
    address public owner;

    using Counters for Counters.Counter;
    Counters.Counter private _postIds;

    struct Post {
      uint id;
      string title;
      bytes32 contentHash;
    //string content;
      bool published;
    }
    /* mappings can be seen as hash tables */
    /* here we create lookups for posts by id and posts by ipfs hash */
    mapping(uint => Post) private idToPost;
    mapping(bytes32 => Post) private hashToPost;

    /* events facilitate communication between smart contractsand their user interfaces  */
    /* i.e. we can create listeners for events in the client and also use them in The Graph  */
    event PostCreated(uint id, string title, bytes32 contentHash);
    event PostUpdated(uint id, string title, bytes32 contentHash, bool published);

    /* when the blog is deployed, give it a name */
    /* also set the creator as the owner of the contract */
    constructor(string memory _name) {
        // console.log("Deploying Blog with name:", _name);
        name = _name;
        owner = msg.sender;
    }

    /* updates the blog name */
    function updateName(string memory _name) public onlyOwner {
        name = _name;
    }

    /* transfers ownership of the contract to another address */
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    /* fetches an individual post by the content hash */
    function fetchPost(bytes32 hash) public view returns(Post memory){
      return hashToPost[hash];
    }

    /* creates a new post */
    function createPost(string memory title, bytes32 hash) public onlyOwner {
        _postIds.increment();
        uint postId = _postIds.current();
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = title;
        post.published = true;
        post.contentHash = hash;
        hashToPost[hash] = post;
        emit PostCreated(postId, title, hash);
    }

    /* updates an existing post */
    function updatePost(uint postId, string memory title, bytes32 hash, bool published) public onlyOwner {
        Post storage post =  idToPost[postId];
        post.title = title;
        post.published = published;
        post.contentHash = hash;
        idToPost[postId] = post;
        hashToPost[hash] = post;
        emit PostUpdated(post.id, title, hash, published);
    }

    /* fetches all posts */
    function fetchPosts() public view returns (Post[] memory) {
        uint itemCount = _postIds.current();
        uint currentIndex = 0;

        Post[] memory posts = new Post[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Post storage currentItem = idToPost[currentId];
            posts[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return posts;
    }

     modifier onlyOwner() {
      require(msg.sender == owner,"Only Owner");
      _;
    }
}
