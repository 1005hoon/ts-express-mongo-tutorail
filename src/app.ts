import express from 'express';
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.connectToTheDatabase();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private async connectToTheDatabase() {
    try {
      const connection = await mongoose.connect(
        process.env.MONGO_URI as string
      );

      console.log(`[DATABASE] ${connection.connection.name}`);
    } catch (error) {
      console.error(error.message);
    }
  }
  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(
        `[${process.env.MODE?.toUpperCase()}] App listening on the port ${
          process.env.PORT
        }`
      );
    });
  }
}

export default App;
