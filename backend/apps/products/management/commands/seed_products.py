from django.core.management.base import BaseCommand
from apps.products.models import Category, Product


CATEGORIES = [
    {"name": "Chocolates", "icon": "🍫", "slug": "chocolates"},
    {"name": "Sweets",     "icon": "🍬", "slug": "sweets"},
    {"name": "Cakes",      "icon": "🎂", "slug": "cakes"},
]

PRODUCTS = [
    {
        "name":        "Dark Belgian Chocolate Bar",
        "description": "Rich 70% cocoa dark chocolate imported from Belgium. Smooth, intense, and perfectly bitter.",
        "price":       349,
        "rating":      4.8,
        "is_featured": True,
        "category":    "chocolates",
        "image_url":   "https://img.freepik.com/free-photo/close-up-chocolate-arrangement_23-2148349283.jpg",
    },
    {
        "name":        "Milk Chocolate Truffle Box",
        "description": "A luxurious box of 12 handcrafted milk chocolate truffles with creamy ganache filling.",
        "price":       599,
        "rating":      4.9,
        "is_featured": True,
        "category":    "chocolates",
        "image_url":   "https://img.freepik.com/free-photo/top-view-assorted-chocolates_23-2148518040.jpg",
    },
    {
        "name":        "White Chocolate Bark",
        "description": "Creamy white chocolate bark topped with dried cranberries, pistachios, and sea salt flakes.",
        "price":       249,
        "rating":      4.5,
        "is_featured": False,
        "category":    "chocolates",
        "image_url":   "https://img.freepik.com/free-photo/delicious-chocolate-assortment-angle_23-2148541064.jpg",
    },
    {
        "name":        "Hazelnut Praline Chocolate",
        "description": "Velvety smooth milk chocolate filled with roasted hazelnut praline. A classic favourite.",
        "price":       399,
        "rating":      4.7,
        "is_featured": False,
        "category":    "chocolates",
        "image_url":   "https://img.freepik.com/free-photo/close-up-chocolate-pieces_23-2148349279.jpg",
    },
    {
        "name":        "Rainbow Gummy Bears",
        "description": "A 500g bag of soft, fruity gummy bears in 6 flavours — strawberry, lemon, orange, apple, grape, and cola.",
        "price":       149,
        "rating":      4.3,
        "is_featured": False,
        "category":    "sweets",
        "image_url":   "https://img.freepik.com/free-photo/gummy-bears-assortment_23-2148908454.jpg",
    },
    {
        "name":        "Classic Butterscotch Candy",
        "description": "Old-fashioned hard butterscotch candies wrapped individually. Smooth, rich, and buttery.",
        "price":       99,
        "rating":      4.2,
        "is_featured": False,
        "category":    "sweets",
        "image_url":   "https://img.freepik.com/free-photo/colorful-hard-candies_23-2148908456.jpg",
    },
    {
        "name":        "Mango Chili Lollipops",
        "description": "Sweet and spicy mango-flavoured lollipops with a chili kick. Addictive and unique.",
        "price":       129,
        "rating":      4.6,
        "is_featured": True,
        "category":    "sweets",
        "image_url":   "https://img.freepik.com/free-photo/colorful-lollipops_23-2148908460.jpg",
    },
    {
        "name":        "Chocolate Fudge Cake",
        "description": "Dense, moist three-layer chocolate fudge cake with dark chocolate ganache frosting.",
        "price":       899,
        "rating":      4.9,
        "is_featured": True,
        "category":    "cakes",
        "image_url":   "https://img.freepik.com/free-photo/chocolate-cake-white-background_23-2148521785.jpg",
    },
    {
        "name":        "Strawberry Cheesecake",
        "description": "Classic New York-style baked cheesecake topped with a fresh strawberry compote glaze.",
        "price":       749,
        "rating":      4.7,
        "is_featured": False,
        "category":    "cakes",
        "image_url":   "https://img.freepik.com/free-photo/strawberry-cheesecake_23-2148571888.jpg",
    },
    {
        "name":        "Red Velvet Cupcake Pack",
        "description": "A pack of 6 soft red velvet cupcakes with cream cheese frosting and chocolate sprinkles.",
        "price":       449,
        "rating":      4.5,
        "is_featured": False,
        "category":    "cakes",
        "image_url":   "https://img.freepik.com/free-photo/red-velvet-cupcakes_23-2148908462.jpg",
    },
]


class Command(BaseCommand):
    help = 'Seed 10 dummy products with categories'

    def handle(self, *args, **kwargs):
        self.stdout.write('🌱 Seeding products...')

        # Create categories
        cat_map = {}
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={'name': cat_data['name'], 'icon': cat_data['icon']}
            )
            cat_map[cat_data['slug']] = cat
            self.stdout.write(f"  {'Created' if created else 'Found'} category: {cat.icon} {cat.name}")

        # Create products
        created_count = 0
        for p in PRODUCTS:
            _, created = Product.objects.get_or_create(
                name=p['name'],
                defaults={
                    'description': p['description'],
                    'price':       p['price'],
                    'rating':      p['rating'],
                    'is_featured': p['is_featured'],
                    'is_available':True,
                    'category':    cat_map[p['category']],
                    'image_url':   p['image_url'],
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f"  ✅ {p['name']}")
            else:
                self.stdout.write(f"  ⚠️  Already exists: {p['name']}")

        self.stdout.write(self.style.SUCCESS(f'\n✅ Done! {created_count} products created.'))