import Pet from "../Models/Pet.js";

export const createPet = async (req, res) => {
    try {
        const { name,petname, age, breed, size, color, medicalHistory,status,location ,gender,description, shelterId } = req.body;
        
        if (!name || !age || !breed || !size || !color ||!medicalHistory  || !status || !shelterId) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }


        let imageUrl = "";
        let videoUrls = [];
        if(req.files?.image[0]){

            imageUrl = req.files.image[0].path;

        }

        if ( req.files?.videos) {
            videoUrls = req.files.videos.map((file) => file.path);
            }

        const pet = new Pet({
            name,
            petname,
            age,
            breed,
            size,
            color,
            gender,
            location,
            description,
            medicalHistory,
            status,
            image: imageUrl,
            video: videoUrls,
            shelter: shelterId,
        });
        await pet.save();
        res.status(201).json({ message: "Pet created successfully", pet });
        
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to create pet"});
    }
};

export const getPets = async (req, res) => {
    const { breed, age, size, gender, location,type, search } = req.query; 
    try {
        const filters = {};
        if (breed) filters.breed = breed;
        if (age) filters.age = { $lte: age }; 
        if (size) filters.size = size;
        if (type) filters.type = type;
        if (gender) filters.gender = gender; 
        if (location) filters.location = location;
        if (search) {
            filters.$or = [
                { name: { $regex: search, $options: "i" } },
                { petname: { $regex: search, $options: "i" } },
                { breed: { $regex: search, $options: "i" } },
                { color: { $regex: search, $options: "i" } },
            ];
        }
      
        const pets = await Pet.find(filters).populate("shelter"); 
        res.status(200).json(pets); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

export const getAllPets = async (req, res) => {
    const {breed, age, size, gender, location,type, search} = req.query;
    try {
        const filter = {}
        if(breed) filter.breed = breed;
        if(age) filter.age = { $lte: age }; 
        if(size) filter.size = size;
        if(type) filter.type = type;
        if(gender) filter.gender = gender; 
        if(location) filter.location = location;
        if(search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { breed: { $regex: search, $options: "i" } },
                {petname: { $regex: search, $options: "i" } },
                { color: { $regex: search, $options: "i" } },
            ];
        }
        if (type) filter.type = type;
        filter.status = "available";
        const pets = await Pet.find(filter).populate("shelter","name email");
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getFosteredPets = async (req, res) => {
    const {breed, age, size, gender,type, location, search} = req.query;
    try {
        const filter = {}
        if(breed) filter.breed = breed;
        if(age) filter.age = { $lte: age };
        if(size) filter.size = size;
        if(type) filter.type = type;
        if(gender) filter.gender = gender; 
        if(location) filter.location = location;
        if(search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { breed: { $regex: search, $options: "i" } },
                {petname: { $regex: search, $options: "i" } },
                { color: { $regex: search, $options: "i" } },
            ];
        }
        if (type) filter.type = type;
        filter.status = "fostered";
        const pets = await Pet.find(filter).populate("shelter","name email");
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getShelterPets = async (req, res) => {
    try {
        let pets;
       
        if(req.shelter){
            
            pets = await Pet.find({shelter: req.shelter._id},{status:"available adopted fostered"} ).populate("shelter","name email");
        }else if(req.user){ 
            
            const shelterId = req.user.shelterId;
            if(!shelterId){ 
                return res.status(404).json({ message: "Shelter not found" });
            }
            pets = await Pet.find({shelter: shelterId}).populate("shelter","name email");
        }else{
            pets = await Pet.find().populate("shelter", "name email");
        }
        
        res.status(200).json({message:"Success", pets});
        
    } catch (error) {
      
            res.status(500).json({ message: error.message });
      
          
    }
};

export const getPetById = async (req, res) => {
    const { id } = req.params;
    try {
        const pet = await Pet.findById(id).populate("shelter","name email");
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePet = async (req, res) => {
    const { id } = req.params;
    const { name, petname, age, breed, size, color,gender, description, location, phoneNumber, medicalHistory, status } = req.body;
    const shelterId = req.user.shelterId;
    const imageUrl = req.file ? req.file.path : null;
    try {
        const pet = await Pet.findById(id);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        if(pet.shelter.toString()!==shelterId.toString()){
            return res.status(403).json({message:"You are not authorized to update This Pet"});
        }

        let imageUrl = pet.image;
        let videoUrls = pet.video || [];
        if (req.file && req.file.image && req.files.image[0]) {
            
            imageUrl = req.files.image[0].path;
           
        }
        if (req.files && req.files.videos) {
                videoUrls = req.files.videos.map((file) => file.path);
                
                }

        pet.name = name || pet.name;
        pet.petname = petname || pet.petname;
        pet.age = age || pet.age;
        pet.breed = breed || pet.breed;
        pet.size = size || pet.size;
        pet.color = color || pet.color;
        gender = gender || pet.gender;
        pet.description = description || pet.description;
        pet.location = location || pet.location;
        pet.phoneNumber = phoneNumber || pet.phoneNumber;
        pet.medicalHistory = medicalHistory || pet.medicalHistory;
        pet.status = status || pet.status;
        pet.image = imageUrl;
        pet.video = videoUrls;
        await pet.save();
        res.status(200).json({ message: "Pet updated successfully", pet });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePetStatus = async (req, res) => {
    const { id } = req.params;
       const {status } = req.body;
    try {
     
        
        const pet = await Pet.findById(id).populate("shelter");
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
       
        if( !req.user || !pet.shelter || pet.shelter._id.toString()!==req.user.shelterId.toString()){
            return res.status(403).json({message:"You are not authorized to update This Pet"});
        }
        pet.status = status;
        await pet.save();
        res.status(200).json({ message: "Pet status updated successfully", pet });
        
        
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePet = async (req, res) => {
    const { id } = req.params;
    
    try {
        const pet = await Pet.findByIdAndDelete(id);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.status(200).json({ message: "Pet deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};