import mongoose from 'mongoose'

const connectdb = async (db: string) => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('=> database connected :)');
  } catch (err: any) {
    console.log('console : EreR  ' + err.message);
    //process exit when failure
    process.exit(1);
  }
};

module.exports = connectdb;
