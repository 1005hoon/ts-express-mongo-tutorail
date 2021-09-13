import express from 'express';
import Controller from 'src/interfaces/controller.interface';
import Post from './post.model';

class PostsController implements Controller {
  public path: '/posts';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.patch(`${this.path}/:id`, this.updatePost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.post(this.path, this.createPost);
  }

  private getAllPosts = async (req: express.Request, res: express.Response) => {
    const posts = await Post.find();
    res.send(posts);
  };

  private getPostById = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const post = await Post.findById(id);
    res.send(post);
  };

  private createPost = async (req: express.Request, res: express.Response) => {
    const postData = req.body;
    const newPost = new Post(postData);
    await newPost.save();
    res.send(newPost);
  };

  private updatePost = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const postData = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, postData, {
      new: true,
    });
    res.send(updatedPost);
  };

  private deletePost = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const deleteResponse = await Post.findByIdAndDelete(id);
    if (deleteResponse) {
      return res.send(200);
    } else {
      return res.send(404);
    }
  };
}

export default PostsController;
