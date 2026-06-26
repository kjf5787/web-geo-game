// Authors: Vojtech Bruza, Grace Houser, and Kayla Fennell
import {
    Button,
    ButtonGroup,
    FormControl,
    FormLabel,
    Grid,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import { global_icon_colors } from "../../data/DataTypes";
import { useConnection } from "../Contexts/ConnectionContext";
import { useGameRoom } from "../Contexts/GameRoomContext";
import TextInput from "./TextInput";
import { useTranslation } from "react-i18next";
import { 
    FaUser, FaUserNinja, FaUserTie, 
    FaUserGraduate, FaChild, FaSmile, FaSmileBeam, FaSmileWink, 
    FaGrinAlt, FaGrinBeam,
    FaStar, FaHeart, FaBolt, FaFire, FaSnowflake,
    FaMusic, FaRocket, FaCrown, FaGem, FaDragon, FaLeaf
} from "react-icons/fa";
import { Box } from "@chakra-ui/react";

// Props Interface
interface EditActionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    player: {
        name: string;
        color: string;
        icon?: string;
    };
}

const ICON_OPTIONS: { name: string; component: React.ElementType }[] = [
    { name: "FaUser", component: FaUser },
    { name: "FaUserNinja", component: FaUserNinja },
    { name: "FaUserTie", component: FaUserTie },
    { name: "FaUserGraduate", component: FaUserGraduate },
    { name: "FaChild", component: FaChild },
    { name: "FaSmile", component: FaSmile },
    { name: "FaSmileBeam", component: FaSmileBeam },
    { name: "FaSmileWink", component: FaSmileWink },
    { name: "FaGrinAlt", component: FaGrinAlt },
    { name: "FaGrinBeam", component: FaGrinBeam },
    { name: "FaStar", component: FaStar },
    { name: "FaHeart", component: FaHeart },
    { name: "FaBolt", component: FaBolt },
    { name: "FaFire", component: FaFire },
    { name: "FaSnowflake", component: FaSnowflake },
    { name: "FaMusic", component: FaMusic },
    { name: "FaRocket", component: FaRocket },
    { name: "FaCrown", component: FaCrown },
    { name: "FaGem", component: FaGem },
    { name: "FaDragon", component: FaDragon },
    { name: "FaLeaf", component: FaLeaf },
];

// Main Component
const EditActionPopup: React.FC<EditActionPopupProps> = ({
    isOpen,
    onClose,
    player,
}) => {
    const { updatePlayer, getPlayerData, players } = useGameRoom();
    const [name, setName] = useState(player.name || "");
    const [selectedColor, setSelectedColor] = useState(player.color || "default");
    const [selectedIcon, setSelectedIcon] = useState(player.icon || "FaUser");
    const firstFieldRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();
    const { localPlayerID } = useConnection();

    const handleSave = () => {
        if (players.find((p) => p.id !== localPlayerID && p.color === selectedColor)) {
            toast({
                title: "Color taken.",
                status: 'error',
                isClosable: true,
            });
            return;
        }
        const localPlayer = getPlayerData(localPlayerID);
        if (!localPlayer) {
            throw Error("Local player not found");
        }
        localPlayer.color = selectedColor;
        localPlayer.name = name;
        localPlayer.icon = selectedIcon;
        updatePlayer(localPlayer);
        onClose();
    };

    const { t } = useTranslation();

    return (

        <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={firstFieldRef}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('lobby.popup.title')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {/* Name Input */}
                    <TextInput
                        ref={firstFieldRef}
                        id="name-input"
                        label={t('lobby.popup.choose-name')}
                        placeholder={t('lobby.popup.name-placeholder')}
                        fontSize="14px"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* Icon Color Selection */}
                    <FormControl mt={4}>
                        <FormLabel>{t('lobby.popup.choose-color')}</FormLabel>
                        <ButtonGroup width="100%">
                            <Grid
                                gap="4px"
                                templateColumns="repeat(auto-fit, minmax(60px, 1fr))"
                                width="100%"
                            >
                                {global_icon_colors.map((color) => (
                                    <Button
                                        // is the color taken by another player?
                                        isDisabled={players.some(p => p.color === color && p.id !== localPlayerID)}
                                        key={color}
                                        bg={`var(--icon-${color})`}
                                        _hover={{ opacity: "0.8" }}
                                        onClick={() => setSelectedColor(color)}
                                        border={
                                            selectedColor === color ? "3px solid black" : "none"
                                        }
                                        height="40px"
                                    />
                                ))}
                            </Grid>
                        </ButtonGroup>
                    </FormControl>

                    {/* Icon Picker */}
                    <FormControl mt={4}>
                        <FormLabel>Choose Icon</FormLabel>
                        <Grid
                            gap="4px"
                            templateColumns="repeat(auto-fit, minmax(48px, 1fr))"
                            width="100%"
                        >
                            {ICON_OPTIONS.map(({ name, component: IconComp }) => (
                                <Box
                                    key={name}
                                    as="button"
                                    onClick={() => setSelectedIcon(name)}
                                    border={selectedIcon === name ? "3px solid black" : "2px solid transparent"}
                                    borderRadius="md"
                                    p="6px"
                                    bg={selectedIcon === name ? "gray.200" : "gray.100"}
                                    _hover={{ bg: "gray.200" }}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    height="40px"
                                >
                                    <IconComp size={22} />
                                </Box>
                            ))}
                        </Grid>
                    </FormControl>
                </ModalBody>

                {/* Save/Cancel Button */}
                <ModalFooter>
                    <Button colorScheme="primary" variant="solid" mr={3} onClick={handleSave}>
                        {t('generic.button.save')}
                    </Button>
                    <Button onClick={onClose}>{t('generic.button.cancel')}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditActionPopup;
