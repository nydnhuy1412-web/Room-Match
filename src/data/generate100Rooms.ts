import type { Room } from '../App';

// Helper function to generate rooms
const imageUrls = [
  'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYmVkcm9vbXxlbnwxfHx8fDE3NjQ5MDQ0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1555930112-0159bcdc3fe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3JtJTIwcm9vbXxlbnwxfHx8fDE3NjQ5MDQ0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1728633764783-ce3311e30708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0OTA0NTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1702014862053-946a122b920d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0ODY1NzgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1615874959474-d609969a20ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJlZHJvb218ZW58MXx8fHwxNzY0OTA0NTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwaG91c2luZ3xlbnwxfHx8fDE3NjQ5MDQ1MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjByb29tfGVufDF8fHx8MTc2NDgzMjM0MXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1611095459865-47682ae3c41c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2NDgyMjAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
];

const districts = ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12', 'Thủ Đức', 'Bình Thạnh', 'Gò Vấp', 'Tân Bình', 'Phú Nhuận', 'Bình Tân', 'Tân Phú'];

const streets = ['Nguyễn Huệ', 'Lê Lợi', 'Võ Văn Ngân', 'Phan Đăng Lưu', 'Cộng Hòa', 'Quang Trung', 'Trần Hưng Đạo', 'Lê Hồng Phong', 'Hoàng Văn Thụ', 'Phan Xích Long', 'Nguyễn Văn Linh', 'Lạc Long Quân'];

const universities = ['ĐH Bách Khoa', 'ĐH Khoa học Tự nhiên', 'ĐH Khoa học Xã hội và Nhân văn', 'ĐH Kinh tế TP.HCM', 'ĐH Nông Lâm', 'ĐH Y Dược TP.HCM', 'ĐH Công nghiệp TP.HCM', 'ĐH Văn Lang', 'ĐH Hồng Bàng', 'ĐH Sư phạm TP.HCM'];

const nearbyPlacesOptions = [
  ['Chợ Bến Thành', 'Công viên 23/9', 'Bệnh viện Chợ Rẫy'],
  ['Chợ An Đông', 'Siêu thị Co.opMart', 'Công viên Lê Văn Tám'],
  ['Chợ Tân Bình', 'Sân bay Tân Sơn Nhất', 'TTTM Aeon Mall'],
  ['Chợ Thủ Đức', 'TTTM Gigamall', 'Công viên phần mềm Quang Trung'],
  ['Chợ Bình Thạnh', 'Vincom Landmark 81', 'Công viên Gia Định'],
  ['Chợ Gò Vấp', 'TTTM Emart', 'Bệnh viện Gò Vấp'],
  ['Chợ Tân Định', 'Công viên Hoàng Văn Thụ', 'Bệnh viện Nhi Đồng 1'],
  ['Chợ Phú Nhuận', 'TTTM Parkson', 'Sân vận động Phú Thọ'],
];

const landlords = [
  { name: 'Chị Lan', phone: '0901234567', responseTime: '5 phút' },
  { name: 'Anh Minh', phone: '0912345678', responseTime: '10 phút' },
  { name: 'Chị Hương', phone: '0923456789', responseTime: '15 phút' },
  { name: 'Anh Tuấn', phone: '0934567890', responseTime: '30 phút' },
  { name: 'Chị Mai', phone: '0945678901', responseTime: '1 giờ' },
];

export function generateRooms(): Room[] {
  const rooms: Room[] = [];
  
  // Tăng lên 300 phòng để có nhiều lựa chọn hơn
  for (let i = 1; i <= 300; i++) {
    const district = districts[i % districts.length];
    const hasLoft = Math.random() > 0.7;
    const maxOccupants = i % 5 === 0 ? 1 : (i % 3 === 0 ? 4 : (i % 2 === 0 ? 3 : 2));
    const currentOccupants = Math.floor(Math.random() * maxOccupants);
    const area = 15 + Math.floor(Math.random() * 35);
    const floor = Math.floor(Math.random() * 8) + 1;
    
    // Giá làm tròn theo từng khoảng
    let price: number;
    const priceCategory = i % 10;
    if (priceCategory < 2) price = [1500000, 1800000, 2000000][Math.floor(Math.random() * 3)]; // 1.5-2tr
    else if (priceCategory < 4) price = [2000000, 2500000, 3000000][Math.floor(Math.random() * 3)]; // 2-3tr
    else if (priceCategory < 6) price = [3000000, 3500000, 4000000][Math.floor(Math.random() * 3)]; // 3-4tr
    else if (priceCategory < 8) price = [4000000, 4500000, 5000000][Math.floor(Math.random() * 3)]; // 4-5tr
    else if (priceCategory < 9) price = [5000000, 5500000, 6000000, 6500000, 7000000][Math.floor(Math.random() * 5)]; // 5-7tr
    else price = [7000000, 7500000, 8000000, 8500000][Math.floor(Math.random() * 4)]; // 7-8.5tr
    
    const amenityPool = ['WiFi', 'Điều hòa', 'Nước nóng', 'Bãi xe', 'An ninh 24/7', 'Thang máy', 'Máy giặt', 'Tủ lạnh'];
    const numAmenities = 3 + Math.floor(Math.random() * 6);
    const amenities = amenityPool.slice(0, numAmenities);
    
    const nearbyPlaces = nearbyPlacesOptions[i % nearbyPlacesOptions.length];
    const university = universities[i % universities.length];
    
    let title = '';
    if (maxOccupants === 1) {
      title = `Phòng 1 người ${hasLoft ? 'có gác' : ''} ${district}`.trim();
    } else {
      title = `Phòng ${maxOccupants} người ${hasLoft ? 'có gác' : 'không gác'} ${district}`;
    }
    
    const tags: string[] = [];
    if (maxOccupants === 1) tags.push('Phòng riêng');
    if (hasLoft) tags.push('Có gác');
    if (price < 2500000) tags.push('Giá rẻ');
    if (price > 5000000) tags.push('Cao cấp');
    if (amenities.includes('Thang máy')) tags.push('Chung cư');
    if (Math.random() > 0.6) tags.push('Phù hợp sinh viên');
    
    rooms.push({
      id: `room-${i}`,
      title,
      address: `${Math.floor(Math.random() * 999) + 1} ${streets[i % streets.length]}`,
      district,
      city: 'TP. Hồ Chí Minh',
      price,
      maxOccupants,
      currentOccupants,
      area,
      images: [
        imageUrls[i % imageUrls.length],
        imageUrls[(i + 1) % imageUrls.length],
        imageUrls[(i + 2) % imageUrls.length],
      ],
      amenities,
      description: `Phòng trọ ${hasLoft ? 'có gác' : 'không gác'} tầng ${floor}, diện tích ${area}m². ${maxOccupants === 1 ? 'Phòng riêng cho 1 người, không chia sẻ.' : `Phòng ở ghép tối đa ${maxOccupants} người.`} Gần ${university}, thuận tiện đi lại. Khu vực an ninh, đầy đủ tiện nghi.`,
      tenants: [],
      availableSpots: maxOccupants - currentOccupants,
      serviceFees: {
        electricity: 2500 + Math.floor(Math.random() * 1500),
        water: 15000 + Math.floor(Math.random() * 10000),
        internet: 50000 + Math.floor(Math.random() * 100000),
        cleaning: Math.random() > 0.5 ? 50000 + Math.floor(Math.random() * 50000) : undefined,
      },
      nearbyUniversities: [university],
      distanceToUniversity: 0.3 + Math.random() * 2.5,
      tags,
      rating: 3.5 + Math.random() * 1.5,
      verified: Math.random() > 0.3,
      hasLoft,
      floor,
      nearbyPlaces,
      landlord: landlords[i % landlords.length],
      mapUrl: `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(streets[i % streets.length] + ', ' + district + ', TP.HCM')}`,
    });
  }
  
  return rooms;
}