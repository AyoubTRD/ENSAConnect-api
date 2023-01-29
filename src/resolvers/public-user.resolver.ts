import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { MediaFile } from '../schemas/file/mediafile.schema';
import { PublicUser } from '../schemas/user/public-user.schema';
import { User } from '../schemas/user/user.schema';
import { MediaFileService } from '../services/mediafile.service';
import { UserService } from '../services/user.service';

@Resolver((of) => PublicUser)
export class PublicUserResolver {
  private mediaService = new MediaFileService();
  private userService = new UserService();

  @FieldResolver((returns) => MediaFile, { nullable: true })
  avatar(@Root() root) {
    const user = (root._doc || root) as User;
    if (!user.avatarFileId) return null;
    return this.mediaService.getMediaFileById(user.avatarFileId as string);
  }

  @Query(() => [PublicUser])
  getAllUsers(): Promise<PublicUser[]> {
    return this.userService.getAll();
  }
}
