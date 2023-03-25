import { AMENITIES, DESCRIPTION, VALID_PROVINCES_CODE } from 'src/common/base.constant';
import { RoomType } from 'src/enums/user.enum';
import faker from 'faker';

export const generateFakeRoomDto = () => {
  const roomName = faker.lorem.words(3);
  const price = faker.datatype.number({ min: 50, max: 500 });
  const numberOfLivingRoom = faker.datatype.number({ min: 1, max: 5 });
  const numberOfBedroom = faker.datatype.number({ min: 1, max: 5 });
  const numberOfBed = faker.datatype.number({ min: 1, max: 5 });
  const numberOfBathroom = faker.datatype.number({ min: 1, max: 5 });
  const roomType =
    RoomType[Object.keys(RoomType)[faker.datatype.number({ min: 0, max: Object.keys(RoomType).length - 1 })]];
  const about = faker.lorem.sentences(3);
  const description = DESCRIPTION[faker.datatype.number({ min: 0, max: DESCRIPTION.length - 1 })];
  const city = VALID_PROVINCES_CODE[faker.datatype.number({ min: 0, max: VALID_PROVINCES_CODE.length - 1 })];
  const amenities = AMENITIES.slice(0, faker.datatype.number({ min: 3, max: AMENITIES.length }));
  const image = Array.from({ length: faker.datatype.number({ min: 3, max: 10 }) }, () => faker.image.imageUrl());
  const address = faker.address.streetAddress();

  return {
    roomName,
    price,
    numberOfLivingRoom,
    numberOfBedroom,
    numberOfBed,
    numberOfBathroom,
    roomType,
    about,
    description,
    city,
    amenities,
    image,
    address,
  };
};

async function getRandomRoomImage() {
  const response = await fetch('https://api.unsplash.com/photos/random?query=room&orientation=landscape', {
    headers: {
      Authorization: 'Client-ID icyX1xBPO773zpMDdNSkwVGDbdUM7cOL35gjLpIv-_c',
    },
  });
  const data = await response.json();
  return data.urls.regular;
}
