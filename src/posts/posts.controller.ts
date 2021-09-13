import express from 'express';
import validationmiddleware from '../middleware/validation.middleware';
import HttpException from '../exceptions/HttpException';
import Controller from '../interfaces/controller.interface';
import CreatePostDto from './post.dto';
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
    this.router.post(
      this.path,
      validationmiddleware(CreatePostDto),
      this.createPost
    );
    this.router.patch(
      `${this.path}/:id`,
      validationmiddleware(CreatePostDto),
      this.updatePost
    );
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  private getAllPosts = async (req: express.Request, res: express.Response) => {
    const posts = await Post.find();
    res.send(posts);
  };

  private getPostById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      return next(new HttpException(404, 'Post not found'));
    }
    res.send(post);
  };

  private createPost = async (req: express.Request, res: express.Response) => {
    const postData = req.body;
    const newPost = new Post(postData);
    await newPost.save();
    res.send(newPost);
  };

  private updatePost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const postData = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, postData, {
      new: true,
    });
    if (!updatedPost) {
      return next(new HttpException(404, 'Post not found'));
    }
    res.send(updatedPost);
  };

  private deletePost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const deleteResponse = await Post.findByIdAndDelete(id);
    if (!deleteResponse) {
      return next(new HttpException(404, 'Post not found'));
    }
    res.send(200);
  };
}

export default PostsController;
