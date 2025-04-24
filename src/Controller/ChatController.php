<?php

namespace App\Controller;

use App\Entity\Message;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class ChatController extends AbstractController
{
    #[Route('/chat', name: 'chat_index', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager): Response
    {
        $messages = $entityManager->getRepository(Message::class)
            ->findBy([], ['timestamp' => 'ASC']);

        return $this->render('chat/index.html.twig', [
            'messages' => $messages,
        ]);
    }

    #[Route('/chat/send/{roomId}', name: 'chat_send', methods: ['POST'])]
public function send(
    int $roomId,
    Request $request, 
    EntityManagerInterface $entityManager,
    HubInterface $hub
): JsonResponse {
    $data = json_decode($request->getContent(), true);

    $message = new Message();
    $message->setContent($data['content']);
    $message->setSender($data['sender']);
    $message->setTimestamp(new \DateTime());
    $message->setRoomId($roomId);

    $entityManager->persist($message);
    $entityManager->flush();

    // Use a private topic for this room
    $update = new Update(
        "/chat/{$roomId}", // private topic
        json_encode([
            'id' => $message->getId(),
            'content' => $message->getContent(),
            'sender' => $message->getSender(),
            'timestamp' => $message->getTimestamp()->format('Y-m-d H:i:s')
        ]),
        true // mark as private
    );

    $hub->publish($update);

    return $this->json([
        'status' => 'success',
        'message' => 'Message sent successfully'
    ]);
}
}