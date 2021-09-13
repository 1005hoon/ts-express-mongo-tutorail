import express from 'express';
import Controller from 'src/interfaces/controller.interface';
import iPost from './post.interface';

class PostsController implements Controller {
  public path: '/posts';
  public router = express.Router();

  private posts: iPost[] = [
    {
      author: 'Hoon',
      title: 'first content',
      content: 'lorem ipsum',
    },
  ];

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createAPost);
  }

  getAllPosts = (req: express.Request, res: express.Response) => {
    res.send(this.posts);
  };

  createAPost = (req: express.Request, res: express.Response) => {
    const post: iPost = req.body;
    this.posts.push(post);
    res.send(post);
  };
}

export default PostsController;
